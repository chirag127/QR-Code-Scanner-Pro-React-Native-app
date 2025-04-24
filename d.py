import requests
from bs4 import BeautifulSoup
import html2text
import os
from urllib.parse import urljoin, urlparse

# Install with: pip install html2text

visited = set()

def sanitize_filename(title):
    return "".join(c for c in title if c.isalnum() or c in " _-").rstrip()

def download_page(url, base_url, save_dir):
    if url in visited:
        return
    visited.add(url)

    try:
        response = requests.get(url)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    # Convert HTML to Markdown
    md_converter = html2text.HTML2Text()
    md_converter.ignore_links = False
    markdown = md_converter.handle(str(soup.body))

    # Save markdown file
    title = soup.title.string if soup.title else urlparse(url).path.strip("/")
    filename = sanitize_filename(title or "index") + ".md"
    filepath = os.path.join(save_dir, filename)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(markdown)
    print(f"Saved: {filepath}")

    # Find and follow internal links
    for link in soup.find_all("a", href=True):
        href = link["href"]
        full_url = urljoin(url, href)
        if full_url.startswith(base_url) and full_url not in visited:
            download_page(full_url, base_url, save_dir)

def crawl_docs(start_url, save_dir="docs"):
    os.makedirs(save_dir, exist_ok=True)
    base_url = "{uri.scheme}://{uri.netloc}".format(uri=urlparse(start_url))
    download_page(start_url, base_url, save_dir)

# Example usage
start_url = "https://docs.expo.dev/"  # Replace with your docs start URL
crawl_docs(start_url)
