import React, { useState } from "react";
import { SearchIcon } from "../ui/Icons";
import StrategyToggle from "../ui/StrategyToggle";

const HomePage = ({ onAnalyze, isLoading, strategy, setStrategy }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (url && !isLoading) onAnalyze(url, strategy);
  };

  return (
    <div className="w-full max-w-3xl text-center z-10 animate-fade-in">
      <img
        src="https://webi.com.br/wp-content/uploads/2025/08/Agencia-Webi-Logotipo-New-scaled.webp"
        alt="Logotipo da Agência Webi"
        className="h-20 md:h-48 w-auto mx-auto mb-10" // Classes para torná-lo grande, centrado e com margem
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = "none";
        }}
      />

      <h1
        className="text-5xl md:text-7xl font-extrabold text-[var(--text-primary)] leading-tight tracking-tighter"
        style={{ textShadow: "0 0 30px rgba(0,0,0,0.5)" }}
      >
        Desvende o Poder do seu Site
      </h1>
      <p className="mt-6 mb-8 text-xl text-[var(--text-secondary)]">
        Uma análise de{" "}
        <span className="font-bold text-[var(--accent-color)]">
          Performance
        </span>{" "}
        e <span className="font-bold text-[var(--accent-color)]">SEO</span> para
        elevar seu projeto.
      </p>

      <StrategyToggle strategy={strategy} setStrategy={setStrategy} />

      <form
        onSubmit={handleSubmit}
        className="mt-8 w-full max-w-2xl mx-auto p-4 glass-pane"
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://seusiteincrivel.com"
            required
            className="w-full px-5 py-4 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="main-button w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SearchIcon />
            {isLoading ? "Analisando..." : "Analisar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HomePage;
