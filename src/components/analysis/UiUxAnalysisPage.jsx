import React, { useState, useEffect } from "react";
import LoadingPage from "./LoadingPage";
import {
  XCircleIcon,
  SearchIcon,
  ArrowLeftIcon,
  LightbulbIcon,
  ShieldCheckIcon,
  PenSquareIcon,
  CrosshairIcon,
  RocketIcon,
  DownloadIcon,
} from "@/components/ui/Icons";

// --- Os componentes internos (SeverityBadge, OverallScore, etc.) permanecem os mesmos ---
const SeverityBadge = ({ severity }) => {
  const severityMap = {
    Crítico: "bg-red-500/20 text-red-400 border-red-500/30",
    Alto: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    Médio: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    Baixo: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  const color =
    severityMap[severity] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  return (
    <span
      className={`px-2 py-1 text-xs font-semibold rounded-md border ${color}`}
    >
      {severity}
    </span>
  );
};

const OverallScore = ({ score, justification }) => {
  if (!score) return null;
  const scoreValue = parseFloat(score.split("/")[0]);
  let colorClass = "text-green-400";
  if (scoreValue < 7) colorClass = "text-amber-400";
  if (scoreValue < 4) colorClass = "text-red-400";

  return (
    <div className="glass-pane p-6 rounded-2xl text-center flex flex-col justify-center">
      <p className="text-sm font-semibold text-[var(--text-secondary)]">
        PONTUAÇÃO GERAL DE UX
      </p>
      <p className={`text-7xl font-bold my-2 ${colorClass}`}>
        {scoreValue.toFixed(1)}
      </p>
      <p className="text-xs text-[var(--text-secondary)] leading-tight">
        {justification}
      </p>
    </div>
  );
};

const AnalysisCard = ({ data }) => (
  <div className="glass-pane p-4 rounded-xl text-sm transition-all hover:bg-white/5">
    <div className="flex justify-between items-start mb-2 gap-2">
      <h3 className="font-bold text-base text-[var(--text-primary)]">
        {data.heuristicName || data.element || data.elementText}
      </h3>
      <SeverityBadge severity={data.severity} />
    </div>
    <div className="space-y-3">
      <div>
        <strong className="text-[var(--text-primary)] block">
          Observação:
        </strong>
        <p className="text-[var(--text-secondary)]">
          {data.observation || data.issue}
        </p>
      </div>
      {data.evidence && (
        <div>
          <strong className="text-[var(--text-primary)] block">
            Evidência:
          </strong>
          <p className="text-[var(--text-secondary)] italic">
            "{data.evidence}"
          </p>
        </div>
      )}
      <div>
        <strong className="text-[var(--text-primary)] block">
          Recomendação:
        </strong>
        <p className="text-[var(--text-secondary)]">
          {data.recommendation || data.suggestion}
        </p>
      </div>
    </div>
  </div>
);

const ReportSection = ({ title, icon, children }) => (
  <section>
    <h2 className="flex items-center gap-3 text-2xl font-bold text-[var(--text-primary)] mb-4 pb-2 border-b-2 border-[var(--glass-border)]">
      {icon}
      <span>{title}</span>
    </h2>
    <div className="space-y-4">{children}</div>
  </section>
);

// --- O COMPONENTE PRINCIPAL AGORA RECEBE OS DADOS VIA PROPS ---
const UiUxAnalysisPage = ({
  onAnalyze,
  analysisData,
  isLoading,
  error,
  onGoBack,
}) => {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("heuristic");

  // --- NOVA FUNÇÃO PARA GERIR A IMPRESSÃO ---
  const handlePrint = () => {
    window.print();
  };

  useEffect(() => {
    // Quando o componente carrega, preenche a URL se uma análise já existir
    if (analysisData?.analyzedUrl) {
      setUrl(analysisData.analyzedUrl);
    }
  }, [analysisData]);

  const { geminiAnalysis } = analysisData || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    onAnalyze(url);
  };

  // --- RENDERIZAÇÃO DO DASHBOARD DE ANÁLISE ---
  if (geminiAnalysis) {
    const TABS = {
      heuristic: {
        label: "Análise Heurística",
        icon: <ShieldCheckIcon className="w-5 h-5" />,
        data: geminiAnalysis.heuristicAnalysis,
      },
      cro: {
        label: "Análise de CRO",
        icon: <CrosshairIcon className="w-5 h-5" />,
        data: geminiAnalysis.croAnalysis,
      },
      writing: {
        label: "Análise de UX Writing",
        icon: <PenSquareIcon className="w-5 h-5" />,
        data: geminiAnalysis.uxWritingAnalysis,
      },
    };

    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 no-print">
          {/* --- LOGOTIPO ADICIONADO AQUI --- */}
          <div className="flex items-center gap-6">
            <img
              src="https://webi.com.br/wp-content/uploads/2025/08/Agencia-Webi-Logotipo-New-scaled.webp"
              alt="Logotipo da Agência Webi"
              className="h-38 w-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none";
              }}
            />
            <div>
              <p className="text-[var(--text-secondary)]">
                Relatório de Análise Estratégica
              </p>
              <h1 className="text-3xl font-bold text-[var(--accent-color)] break-all">
                {analysisData.analyzedUrl}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="main-button flex items-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg h-full"
              >
                <DownloadIcon /> Download PDF
              </button>
              <button
                onClick={onGoBack}
                className="flex items-center gap-2 px-4 py-2 border-2 border-[var(--glass-border)] text-[var(--text-secondary)] rounded-lg hover:bg-white/5 transition h-full"
              >
                <ArrowLeftIcon /> Voltar
              </button>
            </div>
          </div>
        </header>

        {/* O resto da renderização do relatório permanece o mesmo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 printable">
          <aside className="lg:col-span-1 flex flex-col gap-8">
            <OverallScore
              score={geminiAnalysis.executiveSummary?.overallScore}
              justification={geminiAnalysis.executiveSummary?.pageGoal}
            />
            <ReportSection
              title="Sumário Executivo"
              icon={<LightbulbIcon className="w-6 h-6" />}
            >
              <div className="space-y-4 text-sm">
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)] block text-green-400">
                    Pontos Fortes:
                  </strong>
                  {geminiAnalysis.executiveSummary?.keyStrengths}
                </p>
                <p className="text-[var(--text-secondary)]">
                  <strong className="text-[var(--text-primary)] block text-red-400">
                    Preocupações Críticas:
                  </strong>
                  {geminiAnalysis.executiveSummary?.criticalConcerns}
                </p>
              </div>
            </ReportSection>

            <ReportSection
              title="Ganhos Rápidos"
              icon={<RocketIcon className="w-6 h-6" />}
            >
              {geminiAnalysis?.quickWins?.map((item, index) => (
                <div key={index} className="glass-pane p-3 rounded-xl text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[var(--text-primary)]">
                      {item.title}
                    </h3>
                    <SeverityBadge severity={item.impact} />
                  </div>
                  <p className="text-[var(--text-secondary)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </ReportSection>
          </aside>

          <main className="lg:col-span-2 space-y-8">
            <div>
              <div className="border-b-2 border-[var(--glass-border)] mb-4">
                <nav className="-mb-0.5 flex space-x-6">
                  {Object.keys(TABS).map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setActiveTab(tabKey)}
                      className={`flex items-center gap-2 py-4 px-1 inline-flex text-sm font-medium ${
                        activeTab === tabKey
                          ? "border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]"
                          : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {TABS[tabKey].icon}
                      {TABS[tabKey].label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="space-y-4">
                {TABS[activeTab]?.data?.length > 0 ? (
                  TABS[activeTab].data.map((item, index) => (
                    <AnalysisCard key={index} data={item} />
                  ))
                ) : (
                  <div className="text-center text-[var(--text-secondary)] glass-pane p-8 rounded-xl">
                    <p>Nenhum problema encontrado nesta categoria.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Se está a carregar, mostramos a página de loading
  if (isLoading) {
    return <LoadingPage />;
  }

  // --- RENDERIZAÇÃO DA PÁGINA INICIAL ---
  return (
    <div className="w-full max-w-2xl text-center z-10 animate-fade-in-fast p-4 relative">
      <button
        onClick={onGoBack}
        className="absolute top-2 left-2 flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors no-print"
      >
        <ArrowLeftIcon />
        Voltar
      </button>
      <img
        src="https://webi.com.br/wp-content/uploads/2025/08/Agencia-Webi-Logotipo-New-scaled.webp"
        alt="Logotipo da Agência Webi"
        className="h-20 md:h-52 w-auto mx-auto mb-10" // Classes para torná-lo grande, centrado e com margem
        onError={(e) => {
          e.target.onerror = null;
          e.target.style.display = "none";
        }}
      />
      <h1 className="text-4xl sm:text-5xl font-bold text-[var(--text-primary)] pt-12">
        Análise Estratégica de UI/UX
      </h1>
      <p className="mt-4 text-lg text-[var(--text-secondary)]">
        Obtenha uma auditoria de nível especialista sobre a experiência do
        utilizador, conversão e design do seu site.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full"
      >
        <div className="relative w-full">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://exemplo.com.br"
            className="w-full pl-12 pr-4 py-4 text-lg bg-[var(--input-bg)] text-[var(--text-primary)] border-2 border-transparent focus:border-[var(--accent-color)] focus:outline-none rounded-xl transition-all duration-300"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-xl hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Analisar Agora
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-center justify-center gap-2 text-red-500 glass-pane p-4">
          <XCircleIcon className="w-6 h-6" />
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default UiUxAnalysisPage;
