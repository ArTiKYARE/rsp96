import os
import subprocess
import sys
from pathlib import Path

import paramiko

# --- Конфигурация ---
REMOTE_HOST = os.getenv("RSP96_HOST", "").strip()
REMOTE_USER = os.getenv("RSP96_USER", "root").strip()
REMOTE_PASSWORD = os.getenv("RSP96_PASSWORD", "").strip()
REMOTE_BASE = os.getenv("RSP96_REMOTE_BASE", "/opt/rsp96").strip()
REMOTE_CADDYFILE_PATH = os.getenv(
    "RSP96_CADDYFILE_PATH", "/opt/safescan/Caddyfile"
).strip()
REMOTE_RELOAD_CMD = os.getenv(
    "RSP96_RELOAD_CMD",
    "docker exec safescan-caddy caddy reload --config /etc/caddy/Caddyfile --adapter caddyfile",
).strip()
IMAGE_NAME = os.getenv("RSP96_IMAGE_NAME", "rsp96:latest").strip()
CONTAINER_NAME = os.getenv("RSP96_CONTAINER_NAME", "rsp96").strip()


def run(cmd: list[str] | str, check: bool = True, cwd: Path | None = None) -> subprocess.CompletedProcess:
    """Запуск shell-команды с выводом в реальном времени."""
    if isinstance(cmd, list):
        cmd_str = " ".join(cmd)
    else:
        cmd_str = cmd
    print(f">>> {cmd_str}")
    return subprocess.run(cmd_str, shell=True, check=check, cwd=cwd)


def build_image() -> None:
    """Собирает Docker-образ приложения."""
    print("\n=== DOCKER BUILD ===")
    run(["docker", "build", "-t", IMAGE_NAME, "."])


def save_image() -> Path:
    """Сохраняет Docker-образ в tar-архив."""
    print("\n=== DOCKER SAVE ===")
    tar_path = Path(f"{CONTAINER_NAME}.tar")
    if tar_path.exists():
        tar_path.unlink()
    run(["docker", "save", "-o", str(tar_path), IMAGE_NAME])
    return tar_path


def git_push() -> None:
    """Коммитит и пушит изменения в текущую ветку."""
    print("\n=== GIT PUSH ===")
    run(["git", "add", "."])

    has_commits = subprocess.run(
        "git rev-parse HEAD", shell=True, capture_output=True
    ).returncode == 0

    if not has_commits:
        run(['git', 'commit', '-m', '"Initial commit"'])
    else:
        try:
            run(['git', 'commit', '-m', '"deploy: update site"'])
        except subprocess.CalledProcessError:
            print("No changes to commit or commit failed, continuing...")

    run(["git", "push", "origin", "main"])


def ensure_remote_dir(sftp_client, remote_dir: str) -> None:
    """Рекурсивно создаёт удалённые директории (mkdir -p через SFTP)."""
    dirs = []
    current = remote_dir
    while current and current != "/":
        try:
            sftp_client.stat(current)
            break
        except IOError:
            dirs.append(current)
            current = os.path.dirname(current)
    for d in reversed(dirs):
        sftp_client.mkdir(d)


def deploy_ssh() -> None:
    """Деплоит Docker-образ и конфигурацию на сервер."""
    print("\n=== SSH DEPLOY ===")
    if not REMOTE_HOST or not REMOTE_PASSWORD:
        print(
            "\nERROR: SSH credentials not configured.\n"
            "Set environment variables before running deploy.py:\n"
            "  export RSP96_HOST=your.server.ip\n"
            "  export RSP96_USER=root\n"
            "  export RSP96_PASSWORD=your_password\n"
            "  export RSP96_REMOTE_BASE=/opt/rsp96  # optional\n"
            "  export RSP96_CADDYFILE_PATH=/opt/safescan/caddy/Caddyfile  # optional\n"
        )
        sys.exit(1)

    image_tar = save_image()

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(REMOTE_HOST, username=REMOTE_USER, password=REMOTE_PASSWORD)

    sftp = client.open_sftp()
    try:
        # Создаём базовую директорию на сервере
        ensure_remote_dir(sftp, REMOTE_BASE)

        # Загружаем docker-compose.yml
        sftp.put("docker-compose.yml", f"{REMOTE_BASE}/docker-compose.yml")

        # Загружаем образ
        remote_tar_path = f"{REMOTE_BASE}/{image_tar.name}"
        print(f"Uploading {image_tar} to {remote_tar_path} ...")
        sftp.put(str(image_tar), remote_tar_path)

        # Загружаем Caddyfile
        print(f"Uploading Caddyfile to {REMOTE_CADDYFILE_PATH} ...")
        ensure_remote_dir(sftp, os.path.dirname(REMOTE_CADDYFILE_PATH))
        sftp.put("Caddyfile", REMOTE_CADDYFILE_PATH)
    finally:
        sftp.close()

    # Выполняем команды на сервере
    commands = [
        f"cd {REMOTE_BASE} && docker load -i {image_tar.name}",
        f"cd {REMOTE_BASE} && docker compose up -d --force-recreate",
        REMOTE_RELOAD_CMD,
    ]

    full_output = []
    exit_code = 0
    for cmd in commands:
        print(f"\n>>> {cmd}")
        stdin, stdout, stderr = client.exec_command(cmd)
        out = stdout.read().decode("utf-8", errors="replace")
        err = stderr.read().decode("utf-8", errors="replace")
        code = stdout.channel.recv_exit_status()
        full_output.append(f"=== CMD ===\n{cmd}\n=== EXIT ===\n{code}\n=== STDOUT ===\n{out}\n=== STDERR ===\n{err}")
        if code != 0:
            exit_code = code
            print(out[-2000:])
            print(err[-2000:])
            break

    client.close()

    # Удаляем локальный tar
    image_tar.unlink(missing_ok=True)

    with open("deploy_output.txt", "w", encoding="utf-8") as f:
        f.write("\n\n".join(full_output))

    if exit_code != 0:
        print(f"Deploy failed with exit code {exit_code}")
        sys.exit(exit_code)

    print(f"\nDeployed successfully to {REMOTE_HOST}")


def main() -> None:
    build_image()
    git_push()

    if REMOTE_HOST and REMOTE_PASSWORD:
        deploy_ssh()
    else:
        print("\nSSH credentials not set, skipping server deploy.")


if __name__ == "__main__":
    main()
