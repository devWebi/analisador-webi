import React, { useState } from "react";
import { SearchIcon, XCircleIcon } from "./Icons";
import StrategyToggle from "./StrategyToggle";

const LeadGenModal = ({
  onClose,
  onAnalyze,
  isLoading,
  strategy,
  setStrategy,
}) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // --- NOVO ESTADO PARA O CAMPO "CARGO" ---
  const [role, setRole] = useState("");

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (url && name && email && role && !isLoading) {
      // --- O NOVO CAMPO "ROLE" É INCLUÍDO NA CAPTURA ---
      console.log("Novo Lead Capturado:", { name, email, role, url });
      onAnalyze(url, strategy);
      onClose();
    }
  };

  // --- NOVA FUNÇÃO PARA AUTO-CORRIGIR A URL ---
  const handleUrlBlur = () => {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      setUrl(`https://${url}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast p-4">
      <div className="w-full max-w-2xl glass-pane p-8 rounded-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-2">
          Quase lá!
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">
          Preencha os seus dados para receber a sua análise gratuita.
        </p>

        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="O seu nome"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="O seu melhor email"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
          </div>
          {/* --- NOVO CAMPO DE "CARGO" ADICIONADO --- */}
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Seu cargo"
            required
            className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur} // A função de auto-correção é chamada aqui
            placeholder="https://seusiteincrivel.com"
            required
            className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />
          <p className="text-center text-[var(--text-secondary)] text-sm pt-2">
            Escolha a estratégia de análise:
          </p>

          <button
            type="submit"
            disabled={isLoading}
            className="main-button w-full flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SearchIcon />
            {isLoading ? "Analisando..." : "Analisar Agora"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadGenModal;
