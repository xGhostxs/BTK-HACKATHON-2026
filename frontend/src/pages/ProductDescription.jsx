import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

export default function ProductDescription() {
  const [form, setForm] = useState({
    product_name: "",
    category: "",
    features: "",
    tone: "profesyonel",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tones = ["profesyonel", "samimi", "premium", "genç kitleye"];

  const handleSubmit = async () => {
    if (!form.product_name || !form.category || !form.features) {
      setError("Lütfen tüm alanları doldurun.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/product-description`, {
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
        <div className="page-tag">E-Ticaret Aracı</div>
        <h1 className="page-title">Ürün Açıklaması Üret</h1>
        <p className="page-desc">
          Ürün bilgilerini gir, Gemini AI senin için SEO uyumlu, dönüşüm
          odaklı bir açıklama yazsın.
        </p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Ürün Adı</label>
            <input
              type="text"
              placeholder="örn: Bluetooth Kablosuz Kulaklık"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Kategori</label>
            <input
              type="text"
              placeholder="örn: Elektronik / Kulaklık"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="form-group full">
            <label>Ürün Özellikleri</label>
            <textarea
              placeholder="Ürünün özelliklerini, avantajlarını, boyutlarını, malzemesini vb. buraya yaz..."
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </div>
          <div className="form-group full">
            <label>Yazı Tonu</label>
            <div className="tone-selector">
              {tones.map((t) => (
                <button
                  key={t}
                  className={`tone-btn ${form.tone === t ? "active" : ""}`}
                  onClick={() => setForm({ ...form, tone: t })}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Üretiliyor..." : "✨ Açıklama Üret"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          Gemini AI yazıyor...
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
