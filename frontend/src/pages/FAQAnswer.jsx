import { useState } from "react";
import ResultCard from "../components/ResultCard";

const API = "http://localhost:8000";

export default function FAQAnswer() {
  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    question: "",
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sampleQuestions = [
    "Kargo ücretsiz mi?",
    "İade koşulları nedir?",
    "Garantisi var mı?",
    "Orijinal ürün mü?",
  ];

  const handleSubmit = async () => {
    if (!form.product_name || !form.question) {
      setError("Ürün adı ve soru alanları zorunludur.");
      return;
    }
    setError("");
    setLoading(true);
    setResult("");
    try {
      const res = await fetch(`${API}/api/faq-answer`, {
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
        <div className="page-tag">Müşteri Hizmetleri</div>
        <h1 className="page-title">Soru Yanıtlayıcı</h1>
        <p className="page-desc">
          Müşteri sorularına anında, profesyonel ve satışa yönlendiren
          yanıtlar oluştur.
        </p>
      </div>

      <div className="form-card">
        <div className="form-grid">
          <div className="form-group">
            <label>Ürün Adı</label>
            <input
              type="text"
              placeholder="örn: Deri Cüzdan"
              value={form.product_name}
              onChange={(e) => setForm({ ...form, product_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Müşteri Sorusu</label>
            <input
              type="text"
              placeholder="Soruyu buraya yaz..."
              value={form.question}
              onChange={(e) => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div className="form-group full">
            <label>Ürün Açıklaması (Opsiyonel)</label>
            <textarea
              placeholder="Ürün hakkında kısa bilgi ver, daha iyi yanıt üretilsin..."
              value={form.product_description}
              onChange={(e) => setForm({ ...form, product_description: e.target.value })}
              style={{ minHeight: 80 }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8 }}>Hızlı seç:</p>
          <div className="tone-selector">
            {sampleQuestions.map((q) => (
              <button
                key={q}
                className={`tone-btn ${form.question === q ? "active" : ""}`}
                onClick={() => setForm({ ...form, question: q })}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: 13, marginTop: 12 }}>{error}</p>}

        <div className="divider" />

        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Yanıtlanıyor..." : "💬 Yanıt Üret"}
        </button>
      </div>

      {loading && (
        <div className="loading-wrap">
          <div className="spinner" />
          Gemini AI yanıt yazıyor...
        </div>
      )}

      {result && <ResultCard result={result} />}
    </div>
  );
}
