export default function Sidebar({ activePage, setActivePage }) {
  const sections = [
    {
      label: "Otomatik (URL ile)",
      items: [
        { id: "smart-analysis", icon: "🔗", label: "Akıllı Analiz" },
        { id: "smart-compare", icon: "⚖️", label: "URL Karşılaştır" },
      ]
    },
    {
      label: "Manuel",
      items: [
        { id: "description", icon: "✍️", label: "Ürün Açıklaması" },
        { id: "faq", icon: "💬", label: "Soru Yanıtlayıcı" },
        { id: "reviews", icon: "📊", label: "Yorum Analizi" },
        { id: "compare", icon: "📋", label: "Ürün Karşılaştır" },
      ]
    }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">🚀</div>
        <div className="logo-text">Satış<span>AI</span></div>
      </div>

      {sections.map((section) => (
        <div key={section.label} style={{ marginBottom: 24 }}>
          <div className="sidebar-label">{section.label}</div>
          {section.items.map((item) => (
            <div
              key={item.id}
              className={`nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      ))}

      <div className="sidebar-footer">
        <p>⚡ Gemini AI ile çalışıyor</p>
        <span>BTK Hackathon 2026</span>
      </div>
    </aside>
  );
}
