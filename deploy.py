import os
import shutil
import subprocess
import sys
from pathlib import Path

import paramiko

# --- Конфигурация ---
REMOTE_HOST = os.getenv("RSP96_HOST", "")
REMOTE_USER = os.getenv("RSP96_USER", "root")
REMOTE_PASSWORD = os.getenv("RSP96_PASSWORD", "")
REMOTE_BASE = os.getenv("RSP96_REMOTE_BASE", "/var/www/rsp96")
REMOTE_RELOAD_CMD = os.getenv(
    "RSP96_RELOAD_CMD", "systemctl reload nginx || service nginx reload || true")

DIST_DIR = Path("dist")


def run(cmd: list[str] | str, check: bool = True, cwd: Path | None = None) -> subprocess.CompletedProcess:
    """Запуск shell-команды с выводом в реальном времени."""
    if isinstance(cmd, list):
        cmd_str = " ".join(cmd)
    else:
        cmd_str = cmd
    print(f">>> {cmd_str}")
    # На Windows shell=True нужен для нахождения npm/git/cmd-скриптов
    return subprocess.run(cmd_str, shell=True, check=check, cwd=cwd)


def build() -> None:
    """Собирает статический сайт."""
    print("\n=== BUILD ===")
    if DIST_DIR.exists():
        shutil.rmtree(DIST_DIR)
    run(["npm", "run", "build"])
    if not DIST_DIR.exists():
        print("ERROR: dist/ not found after build")
        sys.exit(1)


def git_push() -> None:
    """Коммитит и пушит изменения в текущую ветку."""
    print("\n=== GIT PUSH ===")
    run(["git", "add", "."])

    # Проверяем, есть ли уже коммиты
    has_commits = subprocess.run(
        "git rev-parse HEAD", shell=True, capture_output=True
    ).returncode == 0

    if not has_commits:
        print("No commits yet, creating initial commit...")
        run(['git', 'commit', '-m', '"Initial commit"'])
    else:
        try:
            run(['git', 'commit', '-m', '"deploy: update site"'])
        except subprocess.CalledProcessError:
            print("No changes to commit or commit failed, continuing...")

    run(["git", "push", "origin", "main"])


def deploy_ssh() -> None:
    """Загружает dist/ на сервер по SSH/SFTP и перезапускает веб-сервер."""
    print("\n=== SSH DEPLOY ===")
    if not REMOTE_HOST or not REMOTE_PASSWORD:
        print(
            "\nERROR: SSH credentials not configured.\n"
            "Set environment variables before running deploy.py:\n"
            "  export RSP96_HOST=your.server.ip\n"
            "  export RSP96_USER=root\n"
            "  export RSP96_PASSWORD=your_password\n"
            "  export RSP96_REMOTE_BASE=/var/www/rsp96  # optional\n"
            "  export RSP96_RELOAD_CMD='systemctl reload nginx'  # optional\n"
        )
        sys.exit(1)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(REMOTE_HOST, username=REMOTE_USER, password=REMOTE_PASSWORD)

    # Создаём/очищаем удалённую директорию
    stdin, stdout, stderr = client.exec_command(f"mkdir -p {REMOTE_BASE} && rm -rf {REMOTE_BASE}/*")
    stdout.channel.recv_exit_status()

    sftp = client.open_sftp()
    try:
        uploaded = 0
        for local_path in DIST_DIR.rglob("*"):
            if local_path.is_file():
                relative = local_path.relative_to(DIST_DIR).as_posix()
                remote_path = f"{REMOTE_BASE}/{relative}"
                remote_dir = os.path.dirname(remote_path)
                client.exec_command(f"mkdir -p {remote_dir}")
                sftp.put(str(local_path), remote_path)
                uploaded += 1
        print(f"Uploaded {uploaded} file(s) to {REMOTE_HOST}:{REMOTE_BASE}")
    finally:
        sftp.close()

    # Перезапуск веб-сервера
    print(f"\n>>> {REMOTE_RELOAD_CMD}")
    stdin, stdout, stderr = client.exec_command(REMOTE_RELOAD_CMD)
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    exit_code = stdout.channel.recv_exit_status()
    client.close()

    with open("deploy_output.txt", "w", encoding="utf-8") as f:
        f.write(f"=== EXIT CODE ===\n{exit_code}\n")
        f.write("=== STDOUT ===\n" + out + "\n=== STDERR ===\n" + err)

    if exit_code != 0:
        print(f"Reload command failed with exit code {exit_code}")
        print(out[-2000:])
        print(err[-2000:])
        sys.exit(exit_code)


def deploy_github_pages() -> None:
    """Альтернатива: деплоит dist/ в ветку gh-pages."""
    print("\n=== GITHUB PAGES DEPLOY ===")
    run(["git", "checkout", "--orphan", "gh-pages"])
    run(["git", "rm", "-rf", "."])
    for item in DIST_DIR.iterdir():
        shutil.move(str(item), ".")
    run(["git", "add", "."])
    run(["git", "commit", "-m", "deploy: gh-pages"])
    run(["git", "push", "origin", "gh-pages", "--force"])
    run(["git", "checkout", "main"])


def main() -> None:
    build()
    git_push()

    # По умолчанию пробуем SSH, если заданы креды
    if REMOTE_HOST and REMOTE_PASSWORD:
        deploy_ssh()
    else:
        print("\nSSH credentials not set, skipping server deploy.")
        print("To deploy to your server set RSP96_HOST and RSP96_PASSWORD.")
        print("Or run deploy_github_pages() manually for GitHub Pages.")


if __name__ == "__main__":
    main()
