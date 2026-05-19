#  SatışAI — E-Ticaret & KOBİ Yapay Zeka Asistanı

> BTK Hackathon 2026 | BTK Akademi × Google × GİRVAK

Küçük işletmeler ve e-ticaret satıcıları için Gemini AI destekli araç seti.

##  Özellikler

| Araç | Ne Yapar |
|---|---|
| **Ürün Açıklaması Üretici** | SEO uyumlu, dönüşüm odaklı ürün açıklaması yazar |
| **Soru Yanıtlayıcı** | Müşteri sorularına profesyonel yanıtlar üretir |
| **Yorum Analizi** | Güçlü/zayıf yönleri ve satış önerilerini çıkarır |
| **Ürün Karşılaştırma** | Rakip analizii ve konumlandırma stratejisi önerir |

##  Teknolojiler

- **Frontend**: React + Vite
- **Backend**: Python FastAPI
- **AI**: Google Gemini 2.0 Flash API

---

##  Kurulum

### 1. Gemini API Key Al
[https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) adresinden ücretsiz API key al.

### 2. Backend Kur

```bash
cd backend

# .env dosyası oluştur
# .env içine GEMINI_API_KEY=your_key_here yaz

# Bağımlılıkları yükle
pip install -r requirements.txt

# Çalıştır
uvicorn main:app --reload --port 8000
```

Backend çalışınca: http://localhost:8000

### 3. Frontend Kur

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Çalıştır
npm run dev
```

Frontend çalışınca: http://localhost:3000

---

##  Proje Yapısı

```
satisai/
├── backend/
│   ├── main.py           # FastAPI uygulama + Gemini entegrasyonu
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   └── ResultCard.jsx
    │   └── pages/
    │       ├── ProductDescription.jsx
    │       ├── FAQAnswer.jsx
    │       ├── ReviewAnalysis.jsx
    │       └── CompareProducts.jsx
    ├── package.json
    └── vite.config.js
```
