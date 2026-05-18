from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv
from scraper import scrape_product
import os

load_dotenv()

app = FastAPI(title="SatışAI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE")
client = genai.Client(api_key=GEMINI_API_KEY)


class ProductDescRequest(BaseModel):
    product_name: str
    category: str
    features: str
    tone: str = "profesyonel"  

class FAQRequest(BaseModel):
    product_name: str
    product_description: str
    question: str

class ReviewAnalysisRequest(BaseModel):
    product_name: str
    reviews: str

class CompareRequest(BaseModel):
    product_a: str
    features_a: str
    product_b: str
    features_b: str

def ask_gemini(prompt: str) -> str:
    try:
       
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt,
        )
        return response.text
    except Exception as e:
       
        print(f"\n[!!!] GEMINI API DETAYLI HATA: {str(e)}\n")
   
        raise HTTPException(
            status_code=500, 
            detail= f"Gemini entegrasyon hatası. Detay: {str(e)}"
        )

@app.get("/")
def root():
    return {"status": "SatışAI çalışıyor 🚀"}

@app.post("/api/product-description")
def generate_product_description(req: ProductDescRequest):
    prompt = f"""
Sen deneyimli bir e-ticaret kopya yazarısın. Türkçe yaz.

Ürün Adı: {req.product_name}
Kategori: {req.category}
Özellikler: {req.features}
Ton: {req.tone}

Görev: Bu ürün için Trendyol/Hepsiburada'da üst sıralara çıkacak, {req.tone} tonda SEO uyumlu bir ürün açıklaması yaz.

Çıktı formatı:
- Başlık (60 karakter altı, anahtar kelime içeren)
- Kısa açıklama (2-3 cümle, dikkat çekici)
- Özellikler listesi (5-7 madde, emoji ile)
- SEO anahtar kelimeleri (5 kelime)

Sadece istenilen formatı yaz, başka açıklama ekleme.
"""
    result = ask_gemini(prompt)
    return {"result": result}

@app.post("/api/faq-answer")
def generate_faq_answer(req: FAQRequest):
    prompt = f"""
Sen bir e-ticaret müşteri hizmetleri uzmanısın. Türkçe yaz.

Ürün: {req.product_name}
Ürün Açıklaması: {req.product_description}
Müşteri Sorusu: {req.question}

Görev: Bu soruya 2-3 cümleyle nazik, bilgilendirici ve satışa yönlendiren bir yanıt yaz.
Müşteriye "Siz" diye hitap et.
Sadece yanıtı yaz, başka açıklama ekleme.
"""
    result = ask_gemini(prompt)
    return {"result": result}

@app.post("/api/review-analysis")
def analyze_reviews(req: ReviewAnalysisRequest):
    prompt = f"""
Sen bir ürün analiz uzmanısın. Türkçe yaz.

Ürün: {req.product_name}
Yorumlar:
{req.reviews}

Görev: Bu yorumları analiz et ve şu formatta çıktı ver:

GENEL PUAN: (1-10 arası, yorumlara göre tahmini)

GÜÇLÜ YÖNLER:
- (en çok övülen 3-4 nokta)

ZAYIF YÖNLER:
- (en çok şikayet edilen 2-3 nokta)

SATIŞ ÖNERİLERİ:
- (satıcıya 2-3 somut öneri)

ÖNE ÇIKARILACAK ÖZELLİK:
(Reklamda/açıklamada vurgulanması gereken 1 ana özellik)
"""
    result = ask_gemini(prompt)
    return {"result": result}

@app.post("/api/compare-products")
def compare_products(req: CompareRequest):
    prompt = f"""
Sen bir e-ticaret stratejisti ve ürün konumlandırma uzmanısın. Türkçe yaz.

Ürün A: {req.product_a}
Özellikleri: {req.features_a}

Ürün B: {req.product_b}
Özellikleri: {req.features_b}

Görev: Bu iki ürünü karşılaştır ve şu formatta çıktı ver:

KARŞILAŞTIRMA TABLOSU:
(Önemli kriterleri yan yana karşılaştır)

KAZANAN: (Hangi ürün daha iyi konumlanmış ve neden)

A İÇİN STRATEJİ:
(Ürün A'nın B karşısında nasıl öne çıkabileceği, 2-3 öneri)

FİYATLANDIRMA ÖNERİSİ:
(Hangi fiyat aralığında konumlanmalı)
"""
    result = ask_gemini(prompt)
    return {"result": result}



class UrlRequest(BaseModel):
    url: str
    tone: str = "profesyonel"

class UrlQuestion(BaseModel):
    url: str
    question: str

class CompareUrlRequest(BaseModel):
    url_a: str
    url_b: str


@app.post("/api/url/scrape")
async def scrape_url(req: UrlRequest):
    try:
        data = await scrape_product(req.url)
        return {"product": data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sayfa çekilemedi: {str(e)}")

@app.post("/api/url/description")
async def url_product_description(req: UrlRequest):
    try:
        data = await scrape_product(req.url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sayfa çekilemedi: {str(e)}")
    prompt = f"""
Sen deneyimli bir e-ticaret kopya yazarısın. Türkçe yaz.
Platform: {data.get('platform', '')}
Ürün Adı: {data.get('name', '')}
Fiyat: {data.get('price', '')}
Marka: {data.get('brand', '')}
Mevcut Özellikler: {data.get('features', '')}
Mevcut Açıklama: {data.get('description', '')[:500]}
Görev: Bu ürün için {req.tone} tonda SEO uyumlu yeni bir ürün açıklaması yaz.
Çıktı formatı:
- Başlık (60 karakter altı, anahtar kelime içeren)
- Kısa açıklama (2-3 cümle, dikkat çekici)
- Özellikler listesi (5-7 madde, emoji ile)
- SEO anahtar kelimeleri (5 kelime)
Sadece istenilen formatı yaz, başka açıklama ekleme.
"""
    result = ask_gemini(prompt)
    return {"product": data, "result": result}

@app.post("/api/url/faq")
async def url_faq(req: UrlQuestion):
    try:
        data = await scrape_product(req.url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sayfa çekilemedi: {str(e)}")
    reviews_text = "\n".join(data.get("reviews", [])[:10])
    prompt = f"""
Sen bir e-ticaret müşteri hizmetleri uzmanısın. Türkçe yaz.
Platform: {data.get('platform', '')}
Ürün: {data.get('name', '')}
Ürün Özellikleri: {data.get('features', '')}
Müşteri Yorumlarından Özet: {reviews_text[:400]}
Müşteri Sorusu: {req.question}
Görev: Bu soruya 2-3 cümleyle nazik, bilgilendirici ve satışa yönlendiren bir yanıt yaz.
Müşteriye "Siz" diye hitap et. Sadece yanıtı yaz.
"""
    result = ask_gemini(prompt)
    return {"product": data, "result": result}

@app.post("/api/url/reviews")
async def url_review_analysis(req: UrlRequest):
    try:
        data = await scrape_product(req.url)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sayfa çekilemedi: {str(e)}")
    reviews = data.get("reviews", [])
    if not reviews:
        raise HTTPException(status_code=404, detail="Bu üründe yorum bulunamadı.")
    reviews_text = "\n".join(reviews)
    prompt = f"""
Sen bir ürün analiz uzmanısın. Türkçe yaz.
Platform: {data.get('platform', '')}
Ürün: {data.get('name', '')}
Mevcut Puan: {data.get('rating', 'bilinmiyor')}
Yorumlar:
{reviews_text}
Görev: Bu yorumları analiz et ve şu formatta çıktı ver:
 GENEL PUAN: (1-10 arası)
 GÜÇLÜ YÖNLER:
- (en çok övülen 3-4 nokta)
 ZAYIF YÖNLER:
- (en çok şikayet edilen 2-3 nokta)
 SATIŞ ÖNERİLERİ:
- (satıcıya 2-3 somut öneri)
 ÖNE ÇIKARILACAK ÖZELLİK:
(Reklamda vurgulanması gereken 1 ana özellik)
"""
    result = ask_gemini(prompt)
    return {"product": data, "reviews_count": len(reviews), "result": result}

@app.post("/api/url/compare")
async def url_compare(req: CompareUrlRequest):
    try:
        import asyncio
        data_a, data_b = await asyncio.gather(
            scrape_product(req.url_a),
            scrape_product(req.url_b)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sayfa çekilemedi: {str(e)}")
    prompt = f"""
Sen bir e-ticaret stratejisti ve ürün konumlandırma uzmanısın. Türkçe yaz.
Ürün A ({data_a.get('platform', '')}):
- Ad: {data_a.get('name', '')}
- Fiyat: {data_a.get('price', '')}
- Puan: {data_a.get('rating', '')}
- Özellikler: {data_a.get('features', '')[:300]}
Ürün B ({data_b.get('platform', '')}):
- Ad: {data_b.get('name', '')}
- Fiyat: {data_b.get('price', '')}
- Puan: {data_b.get('rating', '')}
- Özellikler: {data_b.get('features', '')[:300]}
Görev: Bu iki ürünü karşılaştır:
 KARŞILAŞTIRMA TABLOSU: (fiyat, puan, özellikler)
 KAZANAN: (hangisi daha iyi ve neden)
 A İÇİN STRATEJİ: (2-3 somut öneri)
 FİYATLANDIRMA ÖNERİSİ: (A için ideal fiyat aralığı)
"""
    result = ask_gemini(prompt)
    return {"product_a": data_a, "product_b": data_b, "result": result}
