import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

export default function SmartCompare() {
  const [urlA, setUrlA] = useState("");
  const [urlB, setUrlB] = useState("");
  const [result, setResult] = useState("");
  const [productA, setProductA] = useState(null);
  const [productB, setProductB] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const platformLabel = (url) => {
    if (url?.includes("trendyol")) return "🛍️ Trendyol";
    if (url?.includes("hepsiburada")) return "🟠 Hepsiburada";
    if (url?.includes("amazon")) return "📦 Amazon TR";
    return "🔗 Ürün";
  };

  const isValidUrl = (url) =>
    url.includes("trendyol.com") || url.includes("hepsiburada.com") || url.includes("amazon.com.tr");

  const handleCompare = async () => {
    if (!urlA.trim() || !urlB.trim()) { setError("Her iki linki de girin."); return; }
    if (!isValidUrl(urlA) || !isValidUrl(urlB)) {
      setError("Sadece Trendyol, Hepsiburada veya Amazon TR linkleri destekleniyor.");
      return;
    }
    setError(""); setLoading(true); setResult(""); setProductA(null); setProductB(null);

    try {
      const res = await fetch(`${API}/api/url/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url_a: urlA, url_b: urlB }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Bilinmeyen hata");
      }

      const data = await res.json();
      setProductA(data.product_a);
      setProductB(data.product_b);
      setResult(data.result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const ProductChip = ({ product }) => product ? (
    <div style={{
      background: "var(--bg-input)", border: "1px solid var(--border)",
      borderRadius: 10, padding: "10px 14px", marginTop: 8
    }}>
      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700, marginBottom: 4 }}>
        {platformLabel(product.url)} {product.rating && `· ⭐ ${product.rating}`} {product.price && `· 💰 ${product.price}`}
      </div>
      <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{product.name}</div>
    </div>
  ) : null;

  return (
    <div>
      <div className="page-header">
        <div className="page-tag">Otomatik Karşılaştırma</div>
        <h1 className="page-title">Ürün Karşılaştır</h1>
        <p className="page-desc">
          İki ürün linkini yapıştır, sistem otomatik çekip karşılaştırsın.
          Trendyol, Hepsiburada ve Amazon TR destekleniyor.
        </p>
      </div>

      <div className="form-card">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--accent)", marginBottom: 12, letterSpacing: 1 }}>ÜRÜN A (Senin Ürünün)</p>
            <div className="form-group">
              <label>Ürün Linki</label>
              <input
                type="url"
                placeholder="https://www.trendyol.com/..."
                value={urlA}
                onChange={(e) => setUrlA(e.target.value)}
                style={{ fontSize: 12 }}
              />
            </div>
            <ProductChip product={productA} />
          </div>

          <div>
            <p style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, color: "var(--text-muted)", marginBottom: 12, letterSpacing: 1 }}>ÜRÜN B (Rakip)</p>
            <div className="form-group">
              <label>Ürün Linki</label>
              <input
                type="url"
                placeholder="https://www.hepsiburada.com/..."
                value={urlB}
                onChange={(e) => setUrlB(e.target.value)}
                style={{ fontSize: 12 }}
              />
            </div>
            <ProductChip product={productB} />
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 14 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleCompare} disabled={loading}>
          {loading ? "⏳ Sayfalar çekiliyor..." : "⚖️ Karşılaştır"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          <div>
            <div style={{ fontSize: 14, color: "var(--text)" }}>İki ürün sayfası aynı anda açılıyor...</div>
            <div style={{ fontSize: 12, color: "var(--text-dim)", marginTop: 4 }}>Bu işlem 15-25 saniye sürebilir</div>
          </div>
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
