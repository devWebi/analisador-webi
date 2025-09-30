import React, { useState, useEffect, useRef } from "react";

// Os componentes de ícone foram definidos aqui para resolver o erro de compilação anterior.
const SearchIcon = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const XCircleIcon = ({ className = "w-8 h-8" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const roleOptions = [
  "CEO / Sócio / Fundador",
  "Diretor",
  "Gerente",
  "Coordenador",
  "Analista",
  "Estudante",
  "Outros",
  "Conheço o proprietário de uma empresa",
];

const LeadGenModal = ({ onClose, onAnalyze, isLoading, strategy }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    telephone: "",
    role: "",
    url: "",
  });

  const rdFormRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    let attempts = 0;
    console.log("🕵️‍♂️ [RD LOG] Iniciando busca pelo script do RD Station...");
    const intervalId = setInterval(() => {
      attempts++;
      console.log(`...[RD LOG] Tentativa ${attempts}`);

      if (typeof window.RDStationForms !== "undefined" && formRef.current) {
        rdFormRef.current = new window.RDStationForms(
          formRef.current,
          "w-form-site-analisador-ae903e2d34187413ced1"
        );
        console.log(
          "✅ [RD LOG] Sucesso! Instância do formulário RD Station criada e pronta."
        );
        clearInterval(intervalId);
      } else if (attempts > 25) {
        console.error(
          "❌ [RD LOG] Falha! O script do RD Station não foi encontrado no tempo limite."
        );
        clearInterval(intervalId);
      }
    }, 200);

    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUrlBlur = () => {
    if (formData.url && !formData.url.startsWith("http")) {
      setFormData((prevData) => ({
        ...prevData,
        url: `https://${formData.url}`,
      }));
    }
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    console.log("▶️ [APP LOG] Submissão do formulário iniciada.");

    if (Object.values(formData).every(Boolean) && !isLoading) {
      if (rdFormRef.current) {
        console.log(
          "📨 [RD LOG] Preparando para enviar dados para o RD Station..."
        );
        rdFormRef.current.send();
        console.log(
          "✅ [RD LOG] Comando de envio executado. Verifique a plataforma da RD para confirmar o recebimento."
        );
      } else {
        console.error(
          "❌ [RD LOG] ERRO CRÍTICO: A instância do formulário RD não foi criada. O envio não pode ser realizado."
        );
      }

      console.log("📋 [APP LOG] Dados do formulário capturados:", formData);
      onAnalyze(formData.url, strategy);
      onClose();
    } else {
      console.warn(
        "⚠️ [APP LOG] Envio bloqueado. Motivo: Formulário incompleto ou análise em andamento."
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast p-4">
      <div className="w-full max-w-2xl glass-pane p-8 rounded-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <XCircleIcon />
        </button>

        <h2 className="text-3xl font-bold text-center text-[var(--text-primary)] mb-2">
          Quase lá!
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-6">
          Preencha os seus dados para receber a sua análise gratuita.
        </p>

        <form ref={formRef} onSubmit={handleModalSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="O seu nome"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="O seu melhor email"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              placeholder="O seu melhor telefone"
              required
              className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
            />
          </div>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full pl-5 pr-10 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300 appearance-none bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238b949e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1.5em 1.5em",
            }}
          >
            <option value="" disabled className="text-[var(--text-secondary)]">
              Selecione o seu cargo...
            </option>
            {roleOptions.map((role) => (
              <option
                key={role}
                value={role}
                className="bg-[var(--glass-bg)] text-[var(--text-primary)] font-semibold"
              >
                {role}
              </option>
            ))}
          </select>

          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            onBlur={handleUrlBlur}
            placeholder="https://seusiteincrivel.com"
            required
            className="w-full px-5 py-3 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />

          <input
            type="hidden"
            name="conversion_identifier"
            value="w-form-site-analisador-ae903e2d34187413ced1"
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
