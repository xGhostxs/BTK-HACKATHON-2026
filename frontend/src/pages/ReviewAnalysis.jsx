import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

const SAMPLE_REVIEWS = `Ürün gerçekten çok kaliteli, beklediğimden daha iyi geldi. Kargo da hızlıydı.
Fiyatına göre süper bir ürün. Tavsiye ederim.
Malzeme biraz ince geldi ama genel olarak memnunum.
3 ay kullandım, hiç sorun çıkmadı. Kesinlikle alın.
Renk fotoğraftaki gibi değil, biraz farklı geldi. Hayal kırıklığı yaşadım.
Müşteri hizmetleri çok ilgili, sorunum anında çözüldü.`;

export default function ReviewAnalysis() {
  const [form, setForm] = useState({ product_name: "", reviews: "" });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.product_name || !form.reviews) {
      setError("Ürün adı ve yorumlar zorunludur.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/review-analysis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      setResult(data.result);
    } catch {
      setError("Sunucuya bağlanılamadı. Backend çalışıyor mu?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="page-tag">Analiz Aracı</div>
        <h1 className="page-title">Yorum Analizi</h1>
        <p className="page-desc">
          Müşteri yorumlarını yapıştır, güçlü/zayıf yönleri ve satış önerilerini
          anında öğren.
        </p>
      </div>

      <div className="form-card">
        <div className="form-grid single">
          <div className="form-group">
            <label>Ürün Adı</label>
            <input
              type="text"
              placeholder="örn: Spor Ayakkabı"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Müşteri Yorumları</label>
            <textarea
              placeholder="Yorumları buraya yapıştır (her yorum yeni satırda olabilir)..."
              value={form.reviews}
              onChange={(e) => setForm({ ...form, reviews: e.target.value })}
              style={{ minHeight: 160 }}
            />
          </div>
        </div>

        <button
          onClick={() => setForm({ ...form, reviews: SAMPLE_REVIEWS })}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            color: "var(--text-dim)",
            borderRadius: 8,
            padding: "6px 14px",
            fontSize: 12,
            cursor: "pointer",
            marginTop: 8,
            fontFamily: "DM Sans, sans-serif",
          }}
        >
          📝 Örnek yorum yükle
        </button>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Analiz ediliyor..." : "📊 Analiz Et"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          Gemini AI yorumları analiz ediyor...
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
