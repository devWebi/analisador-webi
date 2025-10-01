import React, { useState } from "react";
import LeadGenModal from "../ui/LeadGenModal";

const HomePage = ({ onAnalyze, isLoading, strategy, setStrategy }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="w-full max-w-3xl text-center z-10 animate-fade-in">
        <img
          src="https://webi.com.br/wp-content/uploads/2025/08/Agencia-Webi-Logotipo-New-scaled.webp"
          alt="Logotipo da Agência Webi"
          className="h-20 md:h-48 w-auto mx-auto mb-10"
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
          e <span className="font-bold text-[var(--accent-color)]">SEO</span>{" "}
          para elevar seu projeto.
        </p>

        <div className="mt-10">
          <button
            onClick={() => setIsModalOpen(true)}
            className="main-button px-10 py-5 bg-[var(--accent-color)] text-black text-xl font-bold rounded-xl shadow-lg hover:brightness-110 transform hover:scale-105 transition-all duration-300"
          >
            Iniciar Análise Gratuita
          </button>
        </div>
      </div>

      {isModalOpen && (
        <LeadGenModal
          onClose={() => setIsModalOpen(false)}
          onAnalyze={onAnalyze}
          isLoading={isLoading}
          strategy={strategy}
          setStrategy={setStrategy}
        />
      )}
    </>
  );
};

export default HomePage;
