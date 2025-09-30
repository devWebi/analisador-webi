import React, { useState, useEffect, useRef } from "react";

// Os componentes de ícone foram definidos aqui.
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

  const rdFormContainerRef = useRef(null);

  // Efeito para injetar o script que cria o formulário da RD Station
  useEffect(() => {
    if (rdFormContainerRef.current) {
      const oldScript = document.getElementById("rd-form-script");
      if (oldScript) oldScript.remove();

      const script = document.createElement("script");
      script.id = "rd-form-script";
      script.type = "text/javascript";
      // CORREÇÃO FINAL: Substituímos o ID do Google Analytics pelo seu Token Público da RD.
      script.innerHTML = `new RDStationForms('w-form-site-analisador-ae903e2d34187413ced1', '5bef1d3c38bb3069f81035dcfcebc2d4').createForm();`;

      rdFormContainerRef.current.appendChild(script);
      console.log(
        "✅ [RD LOG] Script do formulário da RD Station injetado com o Token Público correto."
      );
    }
  }, []);

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

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    console.log("▶️ [APP LOG] Submissão iniciada.");

    const rdForm = document.querySelector(
      "#w-form-site-analisador-ae903e2d34187413ced1 form"
    );
    if (rdForm) {
      console.log("✅ [RD LOG] Formulário oculto da RD encontrado.");

      const rdFieldMapping = {
        name: formData.name,
        email: formData.email,
        personal_phone: formData.telephone,
        cf_cargo_select: formData.role,
        cf_qual_e_o_site_da_sua_empresa: formData.url,
        "privacy_data[legal_bases][1][value]": "1",
      };

      for (const [fieldName, value] of Object.entries(rdFieldMapping)) {
        let field = rdForm.querySelector(`[name="${fieldName}"]`);
        if (!field) {
          field = document.createElement("input");
          field.type = "hidden";
          field.name = fieldName;
          rdForm.appendChild(field);
          console.log(
            `[SYNC LOG] Campo oculto "${fieldName}" não encontrado e criado dinamicamente.`
          );
        }
        field.value = value;
        console.log(
          `[SYNC LOG] Campo oculto "${fieldName}" preenchido com o valor: "${value}"`
        );
      }

      const iframeName = "rd-iframe-" + new Date().getTime();
      const iframe = document.createElement("iframe");
      iframe.name = iframeName;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      iframe.onload = () => {
        console.log(
          "✅ [RD LOG] SINAL POSITIVO: A submissão no iframe foi concluída. Os dados foram enviados."
        );
        setTimeout(() => {
          if (document.body.contains(iframe)) document.body.removeChild(iframe);
        }, 500);
      };

      rdForm.target = iframeName;
      console.log(
        "📨 [RD LOG] Disparando submissão direta do formulário oculto..."
      );
      rdForm.submit();
      console.log("✅ [RD LOG] Comando de submissão executado.");
    } else {
      console.error(
        "❌ [RD LOG] ERRO CRÍTICO: Formulário oculto da RD não encontrado."
      );
    }

    console.log("▶️ [APP LOG] Iniciando a análise do site...");
    onAnalyze(formData.url, strategy);
    onClose();
  };

  return (
    <>
      <div ref={rdFormContainerRef} style={{ display: "none" }}>
        <div role="main" id="w-form-site-analisador-ae903e2d34187413ced1"></div>
      </div>

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
              <option
                value=""
                disabled
                className="text-[var(--text-secondary)]"
              >
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
              disabled={isLoading}
              className="main-button w-full flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              <SearchIcon />
              {isLoading ? "A analisar..." : "Analisar Agora"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeadGenModal;
