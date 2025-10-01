import React, { useState } from "react";

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

  const [submitStatus, setSubmitStatus] = useState({
    status: "idle",
    message: "",
  });

  const formatPhone = (value) => {
    if (!value) return "";
    value = value.replace(/\D/g, "");
    value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
    value = value.replace(/(\d)(\d{4})$/, "$1-$2");
    return value;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telephone") {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUrlBlur = () => {
    if (formData.url && !formData.url.startsWith("http")) {
      const newUrl = `https://${formData.url}`;
      setFormData((prev) => ({ ...prev, url: newUrl }));
    }
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || submitStatus.status === "sending") return;

    console.log("▶️ [APP LOG] Submissão iniciada.");
    setSubmitStatus({
      status: "sending",
      message: "A guardar os seus dados...",
    });

    try {
      const response = await fetch("/api/save-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao guardar o lead.");
      }

      console.log("✅ [APP LOG] Sucesso! Lead guardado na base de dados.");
      setSubmitStatus({
        status: "success",
        message: "Dados guardados com sucesso!",
      });

      onAnalyze(formData.url, strategy);
      // O onClose será chamado pela sua lógica de análise, como antes.
      // setTimeout(() => onClose(), 1500); // Descomente se precisar que feche automaticamente.
    } catch (error) {
      console.error("❌ [APP LOG] Erro ao guardar lead:", error);
      setSubmitStatus({ status: "error", message: `Erro: ${error.message}` });
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

        <form onSubmit={handleModalSubmit} className="space-y-4">
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
              placeholder="(XX) XXXXX-XXXX"
              required
              maxLength="15"
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
              backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%path stroke='%238b949e' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
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

          <button
            type="submit"
            disabled={isLoading || submitStatus.status === "sending"}
            className="main-button w-full flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SearchIcon />
            {isLoading
              ? "A analisar..."
              : submitStatus.status === "sending"
              ? "A guardar..."
              : "Analisar Agora"}
          </button>

          {submitStatus.status === "success" && (
            <p className="text-green-500 text-center mt-2">
              {submitStatus.message}
            </p>
          )}
          {submitStatus.status === "error" && (
            <p className="text-red-500 text-center mt-2">
              {submitStatus.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default LeadGenModal;
