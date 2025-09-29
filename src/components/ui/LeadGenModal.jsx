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
  const [telephone, setTelephone] = useState("");
  const [role, setRole] = useState("");

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (url && name && email && telephone && role && !isLoading) {
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
            <input
              type="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              placeholder="O seu melhor telefone"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
          </div>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            // A estilização foi completamente refeita para uma aparência premium
            className="w-full pl-5 pr-10 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300 appearance-none bg-no-repeat"
            style={{
              // Adiciona um ícone de seta (chevron) personalizado
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238b949e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            {/* A primeira opção agora reflete o estado de 'não selecionado' de forma mais elegante */}
            <option value="" disabled className="text-[var(--text-secondary)]">
              Selecione o seu cargo...
            </option>

            {/* As opções agora têm uma estilização consistente com o tema */}
            <option
              value="CEO / Sócio / Fundador"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              CEO / Sócio / Fundador
            </option>
            <option
              value="Diretor"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Diretor
            </option>
            <option
              value="Gerente"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Gerente
            </option>
            <option
              value="Coordenador"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Coordenador
            </option>
            <option
              value="Analista"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Analista
            </option>
            <option
              value="Estudante"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Estudante
            </option>
            <option
              value="Outros"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Outros
            </option>
            <option
              value="Conheço o proprietário de uma empresa"
              className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
            >
              Conheço o proprietário de uma empresa
            </option>
          </select>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onBlur={handleUrlBlur} // A função de auto-correção é chamada aqui
            placeholder="https://seusiteincrivel.com"
            required
            className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />

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
