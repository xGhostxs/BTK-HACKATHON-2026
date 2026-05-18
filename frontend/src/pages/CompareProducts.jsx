import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

export default function CompareProducts() {
  const [form, setForm] = useState({
    product_a: "",
    features_a: "",
    product_b: "",
    features_b: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!form.product_a || !form.product_b) {
      setError("Her iki ürün adı da zorunludur.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/compare-products`, {
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
        <div className="page-tag">Rekabet Analizi</div>
        <h1 className="page-title">Ürün Karşılaştır</h1>
        <p className="page-desc">
          Kendi ürününü rakiple karşılaştır, konumlandırma stratejisi ve
          fiyatlama önerisi al.
        </p>
      </div>

      <div className="form-card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Ürün A */}
          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--accent)", marginBottom: 14, letterSpacing: 1 }}>ÜRÜN A (Senin Ürünün)</p>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Ürün Adı</label>
              <input
                type="text"
                placeholder="örn: Nike Air Max 270"
                value={form.product_a}
                onChange={(e) => setForm({ ...form, product_a: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Özellikler & Fiyat</label>
              <textarea
                placeholder="Özellikleri, fiyatı, avantajları..."
                value={form.features_a}
                onChange={(e) => setForm({ ...form, features_a: e.target.value })}
                style={{ minHeight: 100 }}
              />
            </div>
          </div>

          {/* Ürün B */}
          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text-muted)", marginBottom: 14, letterSpacing: 1 }}>ÜRÜN B (Rakip)</p>
            <div className="form-group" style={{ marginBottom: 14 }}>
              <label>Ürün Adı</label>
              <input
                type="text"
                placeholder="örn: Adidas Ultraboost 22"
                value={form.product_b}
                onChange={(e) => setForm({ ...form, product_b: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Özellikler & Fiyat</label>
              <textarea
                placeholder="Rakip ürünün özellikleri, fiyatı..."
                value={form.features_b}
                onChange={(e) => setForm({ ...form, features_b: e.target.value })}
                style={{ minHeight: 100 }}
              />
            </div>
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Karşılaştırılıyor..." : "⚖️ Karşılaştır"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          Gemini AI analiz yapıyor...
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
