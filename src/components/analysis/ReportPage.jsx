import React, { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import ActionPlan from "./ActionPlan";
import OpportunityItem from "./OpportunityItem";
import PerformanceSummary from "./PerformanceSummary";
import { DownloadIcon } from "../ui/Icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const handlePrint = () => {
  window.print();
};

const GeminiReport = ({ text }) => {
  if (!text) return null;

  const [mainAnalysis, actionPlan] = text.split("### Plano de Ação Priorizado");

  return (
    <div>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h3: ({ node, ...props }) => (
            <h3
              className="text-xl font-bold text-[var(--text-primary)] mt-6 mb-3"
              {...props}
            />
          ),
          p: ({ node, ...props }) => (
            <p
              className="text-[var(--text-secondary)] mb-4 leading-relaxed break-words"
              {...props}
            />
          ),
          ul: ({ node, ...props }) => (
            <ul className="list-disc ml-6 space-y-2" {...props} />
          ),
          li: ({ node, ...props }) => (
            <li className="text-[var(--text-secondary)]" {...props} />
          ),
          strong: ({ node, ...props }) => (
            <strong
              className="font-semibold text-[var(--text-primary)]"
              {...props}
            />
          ),
        }}
      >
        {mainAnalysis}
      </ReactMarkdown>
    </div>
  );
};

const AccordionSection = ({ title, count, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="glass-pane overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center text-left hover:bg-white/5 transition"
      >
        <div className="flex items-center gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
            {title}
          </h3>
          {count > 0 && (
            <span className="text-sm font-mono bg-white/10 text-[var(--text-secondary)] px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <span
          className={`transform transition-transform duration-300 text-[var(--text-secondary)] ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          ▼
        </span>
      </button>
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-4 border-t border-[var(--glass-border)] break-words">
          {children}
        </div>
      </div>
    </div>
  );
};

const ReportPage = ({ data, onReset, onNavigateToUiUx }) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast">
      <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6 no-print">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <img
            src="https://webi.com.br/wp-content/uploads/2025/08/Agencia-Webi-Logotipo-New-scaled.webp"
            alt="Logotipo da Agência Webi"
            className="h-12 sm:h-16 w-auto flex-shrink-0"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = "none";
            }}
          />
          <div>
            <p className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
              Relatório de Análise:{" "}
              <span className="capitalize font-bold text-[var(--text-primary)] bg-white/10 px-2 py-0.5 rounded-md">
                {data.strategy}
              </span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)] break-all">
              {data.url}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={onReset}
            className="flex-1 md:flex-none px-4 py-2 border-2 border-[var(--glass-border)] text-sm text-[var(--text-secondary)] rounded-lg hover:bg-white/5 transition h-full"
          >
            Analisar Outra URL
          </button>
          <button
            id="download-button"
            onClick={handlePrint}
            className="flex-1 md:flex-none main-button flex items-center justify-center gap-2 px-4 py-2 bg-[var(--accent-color)] text-black text-sm font-bold rounded-lg h-full"
          >
            <DownloadIcon /> Download PDF
          </button>
        </div>
      </header>

      <div id="report-container" className="p-0 sm:p-8">
        <PerformanceSummary metrics={data.detailedMetrics} />

        {/* --- ALTERAÇÃO 1: SECÇÃO "RESUMO GERAL" MOVIDA PARA AQUI --- */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
            Resumo Geral
          </h2>
          {/* --- ALTERAÇÃO 2: GRID ATUALIZADO PARA 4 COLUNAS EM TELAS MÉDIAS --- */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <ScoreGauge score={data.performanceScore} title="Performance" />
            <ScoreGauge
              score={data.accessibilityScore}
              title="Acessibilidade"
            />
            <ScoreGauge score={data.bestPracticesScore} title="Boas Práticas" />
            <ScoreGauge score={data.seoScore} title="SEO" />
          </div>
        </section>

        {/* O layout do resto do conteúdo foi ajustado para manter a estrutura */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Você Também Pode:
              </h2>
              <ActionPlan
                items={data.actionPlan}
                onNavigate={onNavigateToUiUx}
              />
            </section>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            <AccordionSection
              title="Análise do Consultor de IA"
              defaultOpen={true}
            >
              <GeminiReport text={data.geminiAnalysis} />
            </AccordionSection>

            <AccordionSection
              title="Oportunidades de Otimização"
              count={data.opportunities?.length}
            >
              <div className="space-y-3">
                {data.opportunities && data.opportunities.length > 0 ? (
                  data.opportunities.map((op, i) => (
                    <OpportunityItem key={i} opportunity={op} />
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-center">
                    Nenhuma oportunidade de otimização encontrada.
                  </p>
                )}
              </div>
            </AccordionSection>

            <AccordionSection
              title="Diagnóstico Completo"
              count={data.diagnostics?.length}
            >
              <div className="space-y-3">
                {data.diagnostics && data.diagnostics.length > 0 ? (
                  data.diagnostics.map((diag, i) => (
                    <OpportunityItem key={i} opportunity={diag} />
                  ))
                ) : (
                  <p className="text-[var(--text-secondary)] text-center">
                    Nenhum item de diagnóstico encontrado.
                  </p>
                )}
              </div>
            </AccordionSection>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
