import asyncio
from bs4 import BeautifulSoup
from concurrent.futures import ThreadPoolExecutor
from curl_cffi import requests  

def detect_platform(url: str) -> str:
    if "trendyol.com" in url:
        return "trendyol"
    elif "hepsiburada.com" in url:
        return "hepsiburada"
    elif "amazon.com.tr" in url:
        return "amazon"
    return "unknown"

def fetch_html(url: str) -> BeautifulSoup:
    try:
        resp = requests.get(
            url, 
            impersonate="chrome120", 
            timeout=30.0
        )
        
        if resp.status_code != 200:
            raise ValueError(f"Site HTTP {resp.status_code} hatası döndürdü. İstek engellenmiş olabilir.")
            
        return BeautifulSoup(resp.content, "html.parser")
        
    except requests.errors.Timeout:
        raise ValueError(f"Hedef site 30 saniye içinde yanıt vermedi (Timeout): {url}")
    except Exception as e:
        raise ValueError(f"Sayfa çekilirken beklenmeyen bir hata oluştu: {str(e)}")

def safe_text(soup, selectors):
    for sel in selectors:
        el = soup.select_one(sel)
        if el and el.get_text(strip=True):
            return el.get_text(strip=True)
    return ""

def safe_all_texts(soup, selectors, limit=20):
    for sel in selectors:
        els = soup.select(sel)
        texts = [e.get_text(strip=True) for e in els if e.get_text(strip=True)]
        if texts:
            return texts[:limit]
    return []

def scrape_trendyol_sync(url: str) -> dict:
    result = {"platform": "Trendyol", "url": url}
    soup = fetch_html(url)

    result["name"] = safe_text(soup, [
        "h1.pr-new-br span", "h1.product-name", ".product-name h1",
        "h1[class*='product']", "h1"
    ])
    result["price"] = safe_text(soup, [
        ".prc-box-dscntd", ".prc-box-sllng", ".product-price-container span",
        "[class*='prc-box']"
    ])
    result["brand"] = safe_text(soup, ["h1.pr-new-br a", ".product-brand-name"])
    result["rating"] = safe_text(soup, [
        ".pr-rnr-sm-p", ".score-item", "[class*='rating']"
    ])

    features = safe_all_texts(soup, [
        ".detail-attr-item", ".product-feature-item",
        "[class*='detail-attr']", ".product-properties li"
    ], 10)
    result["features"] = " | ".join(features)

    result["description"] = safe_text(soup, [
        ".product-description-text", "#product-description-content",
        ".product-content", "[class*='description']"
    ])

    reviews = safe_all_texts(soup, [
        ".comment-text", ".pr-rnr-com-tx",
        "[class*='comment-text']", "[class*='review']"
    ], 20)
    result["reviews"] = reviews

    return result

def scrape_hepsiburada_sync(url: str) -> dict:
    result = {"platform": "Hepsiburada", "url": url}
    soup = fetch_html(url)

    result["name"] = safe_text(soup, [
        "h1[itemprop='name']", "h1.product-name",
        "[class*='product-name']", "h1"
    ])
    result["price"] = safe_text(soup, [
        "span[itemprop='price']", ".price-value",
        "[class*='price']", ".product-price"
    ])
    result["rating"] = safe_text(soup, [
        "[itemprop='ratingValue']", ".rating-score",
        "[class*='rating']"
    ])

    features = safe_all_texts(soup, [
        ".spec-table tr", ".product-feature-item",
        ".product-attributes li", "[class*='spec']"
    ], 10)
    result["features"] = " | ".join(features)

    result["description"] = safe_text(soup, [
        "#productDescriptionContent", ".product-description",
        "[class*='description']"
    ])

    reviews = safe_all_texts(soup, [
        "[class*='ReviewCard'] p", ".review-text",
        ".comment-text", "[class*='review']"
    ], 20)
    result["reviews"] = reviews

    return result

def scrape_amazon_sync(url: str) -> dict:
    result = {"platform": "Amazon TR", "url": url}
    soup = fetch_html(url)

    result["name"] = safe_text(soup, ["#productTitle", "h1.a-size-large"])
    result["price"] = safe_text(soup, [
        ".a-price-whole", "#priceblock_ourprice",
        ".a-offscreen", "[class*='price']"
    ])
    result["rating"] = safe_text(soup, [
        "#acrPopover span.a-size-base", ".a-icon-alt"
    ])

    features = safe_all_texts(soup, [
        "#feature-bullets li span", ".a-unordered-list .a-list-item"
    ], 8)
    result["features"] = " | ".join([f for f in features if f and len(f) > 3])

    result["description"] = safe_text(soup, [
        "#productDescription p", "#productDescription"
    ])

    reviews = safe_all_texts(soup, [
        ".review-text-content span", "[data-hook='review-body'] span"
    ], 20)
    result["reviews"] = [r for r in reviews if len(r) > 20]

    return result

def scrape_product_sync(url: str) -> dict:
    platform = detect_platform(url)
    if platform == "trendyol":
        return scrape_trendyol_sync(url)
    elif platform == "hepsiburada":
        return scrape_hepsiburada_sync(url)
    elif platform == "amazon":
        return scrape_amazon_sync(url)
    else:
        raise ValueError("Desteklenmeyen platform. Lütfen Trendyol, Hepsiburada veya Amazon TR linki girin.")

_executor = ThreadPoolExecutor(max_workers=4)

async def scrape_product(url: str) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(_executor, scrape_product_sync, url)
