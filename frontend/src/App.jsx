import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ProductDescription from "./pages/ProductDescription";
import FAQAnswer from "./pages/FAQAnswer";
import ReviewAnalysis from "./pages/ReviewAnalysis";
import CompareProducts from "./pages/CompareProducts";
import SmartAnalysis from "./pages/SmartAnalysis";
import SmartCompare from "./pages/SmartCompare";
import "./App.css";

export default function App() {
  const [activePage, setActivePage] = useState("smart-analysis");

  const pages = {
    "smart-analysis": <SmartAnalysis />,
    "smart-compare": <SmartCompare />,
    "description": <ProductDescription />,
    "faq": <FAQAnswer />,
    "reviews": <ReviewAnalysis />,
    "compare": <CompareProducts />,
  };

  return (
    <div className="app">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="main-content">
        {pages[activePage]}
      </main>
    </div>
  );
}
