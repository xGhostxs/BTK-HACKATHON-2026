import { useState } from "react";

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="result-card">
      <div className="result-header">
        <span className="result-title">✨ Sonuç</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? "✅ Kopyalandı" : "📋 Kopyala"}
        </button>
      </div>
      <div className="result-text">{result}</div>
    </div>
  );
}
