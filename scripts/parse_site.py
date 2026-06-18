import requests
from bs4 import BeautifulSoup
import json
import os
import re
import urllib.parse
from pathlib import Path

BASE_URL = "https://rsp96.ru"
DATA_DIR = Path(__file__).parent.parent / "data"
IMG_DIR = Path(__file__).parent.parent / "assets" / "images"
DATA_DIR.mkdir(parents=True, exist_ok=True)
IMG_DIR.mkdir(parents=True, exist_ok=True)

SITEMAPS = {
    "pages": f"{BASE_URL}/page-sitemap.xml",
    "services": f"{BASE_URL}/services-sitemap.xml",
}


def fetch(url):
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    return r.text


IMAGE_EXTENSIONS = (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".pdf")


def parse_sitemap(xml):
    soup = BeautifulSoup(xml, "xml")
    urls = []
    for loc in soup.find_all("loc"):
        url = loc.get_text(strip=True)
        if url.endswith(".xml"):
            continue
        if any(url.lower().endswith(ext) for ext in IMAGE_EXTENSIONS):
            continue
        urls.append(url)
    return urls


def clean_text(text):
    return re.sub(r"\s+", " ", text).strip()


def extract_section_info(section):
    """Извлекает заголовок и текст из секции."""
    title = section.find(["h1", "h2", "h3"], recursive=False)
    title_text = clean_text(title.get_text()) if title else None
    texts = []
    for p in section.find_all("p", recursive=True):
        txt = clean_text(p.get_text())
        if txt:
            texts.append(txt)
    lists = []
    for ul in section.find_all(["ul", "ol"], recursive=True):
        items = [clean_text(li.get_text()) for li in ul.find_all("li") if clean_text(li.get_text())]
        if items:
            lists.append(items)
    return {"title": title_text, "texts": texts, "lists": lists}


def extract_images(soup):
    images = []
    for img in soup.find_all("img"):
        src = img.get("src") or img.get("data-src")
        if not src:
            continue
        src = urllib.parse.urljoin(BASE_URL, src)
        if "wp-content/uploads" in src:
            images.append({
                "url": src,
                "alt": img.get("alt", ""),
                "width": img.get("width"),
                "height": img.get("height"),
            })
    # Фоновые изображения из style атрибутов
    for tag in soup.find_all(style=True):
        style = tag["style"]
        matches = re.findall(r'url\(([^)]+)\)', style)
        for s in matches:
            s = s.strip('"\'')
            if "wp-content/uploads" in s:
                images.append({"url": urllib.parse.urljoin(BASE_URL, s), "alt": "", "background": True})
    # Уникализируем
    seen = set()
    unique = []
    for img in images:
        if img["url"] not in seen:
            seen.add(img["url"])
            unique.append(img)
    return unique


def parse_page(url):
    html = fetch(url)
    soup = BeautifulSoup(html, "html.parser")

    title_tag = soup.find("title")
    meta_desc = soup.find("meta", attrs={"name": "description"})
    h1 = soup.find("h1")

    # Основной контент — от page-header до footer
    page_header = soup.find("section", class_="page-header")
    main_content = []

    # Берем все section после header до footer
    sections = soup.find_all("section")
    for sec in sections:
        cls = " ".join(sec.get("class", []))
        if "page-header" in cls:
            continue
        if "footer" in cls or sec.find_parent("footer"):
            continue
        if "cookie-alert" in cls:
            continue
        info = extract_section_info(sec)
        if info["title"] or info["texts"]:
            main_content.append({"class": cls, **info})

    # Извлекаем ссылки на услуги/меню
    nav_links = []
    for nav in soup.find_all("nav"):
        for a in nav.find_all("a"):
            nav_links.append({"text": clean_text(a.get_text()), "href": a.get("href")})

    images = extract_images(soup)

    return {
        "url": url,
        "title": clean_text(title_tag.get_text()) if title_tag else None,
        "meta_description": meta_desc.get("content") if meta_desc else None,
        "h1": clean_text(h1.get_text()) if h1 else None,
        "sections": main_content,
        "images": images,
        "nav_links": nav_links,
    }


def download_image(url):
    try:
        r = requests.get(url, timeout=30)
        r.raise_for_status()
        parsed = urllib.parse.urlparse(url)
        path = parsed.path.lstrip("/")
        filename = os.path.basename(path) or "image"
        # Очистка имени файла
        filename = re.sub(r'[^\w\-\.]', '_', filename)
        if not filename:
            filename = "image.bin"
        dest = IMG_DIR / filename
        with open(dest, "wb") as f:
            f.write(r.content)
        return str(dest.relative_to(Path(__file__).parent.parent))
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return None


def main():
    all_urls = set()
    for name, sm_url in SITEMAPS.items():
        xml = fetch(sm_url)
        urls = parse_sitemap(xml)
        all_urls.update(urls)
        print(f"{name}: {len(urls)} URLs")

    all_urls = sorted(all_urls)
    pages = []
    for url in all_urls:
        print(f"Parsing {url}...")
        try:
            page = parse_page(url)
            pages.append(page)
        except Exception as e:
            print(f"Failed to parse {url}: {e}")

    # Скачиваем изображения
    all_images = set()
    for p in pages:
        for img in p.get("images", []):
            all_images.add(img["url"])
    print(f"Downloading {len(all_images)} images...")
    downloaded = {}
    for url in sorted(all_images):
        local = download_image(url)
        if local:
            downloaded[url] = local

    # Подменяем пути
    for p in pages:
        for img in p.get("images", []):
            img["local"] = downloaded.get(img["url"])

    output = {
        "base_url": BASE_URL,
        "pages": pages,
    }
    out_file = DATA_DIR / "site_content.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)
    print(f"Saved to {out_file}")


if __name__ == "__main__":
    main()
