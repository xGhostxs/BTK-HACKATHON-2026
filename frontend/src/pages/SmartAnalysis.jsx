import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

const TOOLS = [
  { id: "description", label: "Ürün Açıklaması", icon: "✍️", endpoint: "/api/url/description", needsQuestion: false, needsTone: true },
  { id: "faq", label: "Soru Yanıtlayıcı", icon: "💬", endpoint: "/api/url/faq", needsQuestion: true, needsTone: false },
  { id: "reviews", label: "Yorum Analizi", icon: "📊", endpoint: "/api/url/reviews", needsQuestion: false, needsTone: false },
];

const TONES = ["profesyonel", "samimi", "premium", "genç kitleye"];

const SAMPLE_QUESTIONS = ["Kargo ücretsiz mi?", "İade koşulları nedir?", "Garantisi var mı?", "Orijinal ürün mü?"];

export default function SmartAnalysis() {
  const [url, setUrl] = useState("");
  const [activeTool, setActiveTool] = useState("description");
  const [tone, setTone] = useState("profesyonel");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState("");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewsCount, setReviewsCount] = useState(0);

  const tool = TOOLS.find((t) => t.id === activeTool);

  const handleAnalyze = async () => {
    if (!url.trim()) { setError("Lütfen bir ürün linki girin."); return; }
    if (!url.includes("trendyol.com") && !url.includes("hepsiburada.com") && !url.includes("amazon.com.tr")) {
      setError("Sadece Trendyol, Hepsiburada veya Amazon TR linkleri destekleniyor.");
      return;
    }
    if (tool.needsQuestion && !question.trim()) { setError("Lütfen bir soru girin."); return; }
    setError(""); setLoading(true); setResult(""); setProduct(null);

    try {
      const body = { url };
      if (tool.needsTone) body.tone = tone;
      if (tool.needsQuestion) body.question = question;

      const res = await fetch(`${API}${tool.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Bilinmeyen hata");
      }

      const data = await res.json();
      setProduct(data.product);
      setResult(data.result);
      if (data.reviews_count) setReviewsCount(data.reviews_count);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const platformIcon = (url) => {
    if (url?.includes("trendyol")) return "🛍️ Trendyol";
    if (url?.includes("hepsiburada")) return "🟠 Hepsiburada";
    if (url?.includes("amazon")) return "📦 Amazon TR";
    return "";
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-tag">Otomatik Analiz</div>
        <h1 className="page-title">Akıllı Ürün Asistanı</h1>
        <p className="page-desc">
          Ürün linkini yapıştır — yorumları, özellikleri ve bilgileri otomatik çekip analiz edelim.
        </p>
      </div>

      {/* Tool Seçici */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {TOOLS.map((t) => (
          <button
            key={t.id}
            className={`tone-btn ${activeTool === t.id ? "active" : ""}`}
            onClick={() => { setActiveTool(t.id); setResult(""); setProduct(null); setError(""); }}
            style={{ fontSize: 14, padding: "10px 18px" }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="form-card">
        {/* URL Input */}
        <div className="form-group" style={{ marginBottom: 16 }}>
          <label>Ürün Linki</label>
          <input
            type="url"
            placeholder="https://www.trendyol.com/... veya hepsiburada.com/... veya amazon.com.tr/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>

        {/* Ton seçici (sadece açıklama için) */}
        {tool.needsTone && (
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Yazı Tonu</label>
            <div className="tone-selector">
              {TONES.map((t) => (
                <button key={t} className={`tone-btn ${tone === t ? "active" : ""}`} onClick={() => setTone(t)}>{t}</button>
              ))}
            </div>
          </div>
        )}

        {/* Soru girişi (sadece FAQ için) */}
        {tool.needsQuestion && (
          <div className="form-group" style={{ marginBottom: 16 }}>
            <label>Müşteri Sorusu</label>
            <input
              type="text"
              placeholder="Müşterinin sorduğu soruyu yaz..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="tone-selector" style={{ marginTop: 8 }}>
              {SAMPLE_QUESTIONS.map((q) => (
                <button key={q} className={`tone-btn ${question === q ? "active" : ""}`} onClick={() => setQuestion(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginBottom: 12 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleAnalyze} disabled={loading}>
          {loading ? "⏳ Sayfa çekiliyor..." : `${tool.icon} ${tool.label} Üret`}
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <div>
            <div style={{ fontSize: 14, color: "var(--text)" }}>Ürün sayfası açılıyor ve veriler çekiliyor...</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Bu işlem 10-20 saniye sürebilir</div>
          </div>
        </div>
      )}

      {/* Ürün bilgi kartı */}
      {product && (
        <div className="form-card" style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>{platformIcon(product.url)}</span>
            {product.rating && <span style={{ fontSize: 12, color: "var(--text-dim)" }}>⭐ {product.rating}</span>}
            {reviewsCount > 0 && <span style={{ fontSize: 12, color: "var(--text-dim)" }}>💬 {reviewsCount} yorum çekildi</span>}
            {product.price && <span style={{ fontSize: 12, color: "var(--text-dim)" }}>💰 {product.price}</span>}
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.4 }}>{product.name}</div>
          {product.features && (
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 8, lineHeight: 1.6 }}>
              {product.features.split("|").slice(0, 4).join(" · ")}
            </div>
          )}
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
