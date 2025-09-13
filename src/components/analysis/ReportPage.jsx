import React, { useState } from "react";
import ScoreGauge from "./ScoreGauge";
import DetailedMetricItem from "./DetailedMetricItem";
import ActionPlan from "./ActionPlan";
import OpportunityItem from "./OpportunityItem";
import { DownloadIcon } from "../ui/Icons";

const handlePrint = () => {
  window.print();
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
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {title}
          </h3>
          {count !== undefined && (
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
        <div className="p-4 border-t border-[var(--glass-border)]">
          {children}
        </div>
      </div>
    </div>
  );
};

const ReportPage = ({ data, onReset }) => {
  const getLcpStatus = (lcp) =>
    lcp <= 2.5 ? "good" : lcp <= 4.0 ? "warning" : "bad";
  const getClsStatus = (cls) => (cls <= 0.1 ? "good" : "warning");

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 gap-4 no-print">
        <div>
          <p className="text-[var(--text-secondary)] flex items-center gap-2">
            Relatório de Análise:{" "}
            <span className="capitalize font-bold text-[var(--text-primary)] bg-white/10 px-2 py-0.5 rounded-md">
              {data.strategy}
            </span>
          </p>
          <h1 className="text-4xl font-bold text-[var(--accent-color)] break-all">
            {data.url}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            className="px-6 py-2 border-2 border-[var(--glass-border)] text-[var(--text-secondary)] rounded-lg hover:bg-white/5 transition h-full"
          >
            Analisar Outra URL
          </button>
          <button
            id="download-button"
            onClick={handlePrint}
            className="main-button flex items-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg h-full"
          >
            <DownloadIcon /> Download PDF
          </button>
        </div>
      </header>

      <div id="report-container" className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Resumo Geral
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <ScoreGauge score={data.performanceScore} title="Performance" />
                <ScoreGauge
                  score={data.accessibilityScore}
                  title="Acessibilidade"
                />
                <ScoreGauge
                  score={data.bestPracticesScore}
                  title="Boas Práticas"
                />
                <ScoreGauge score={data.seoScore} title="SEO" />
              </div>
            </section>
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Plano de Ação Imediato
              </h2>
              <ActionPlan items={data.actionPlan} />
            </section>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-8">
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Métricas Principais
              </h2>
              <div className="space-y-3 glass-pane p-4">
                <DetailedMetricItem
                  status={getLcpStatus(data.coreWebVitals.lcp)}
                  label="Largest Contentful Paint (LCP)"
                  value={`${data.coreWebVitals.lcp}s`}
                  explanation="Mede o tempo de carregamento do maior elemento visível."
                />
                <DetailedMetricItem
                  status={getClsStatus(data.coreWebVitals.cls)}
                  label="Cumulative Layout Shift (CLS)"
                  value={data.coreWebVitals.cls}
                  explanation="Mede a estabilidade visual da página."
                />
              </div>
            </section>

            <section>
              <div className="space-y-4">
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
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
