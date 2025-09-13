import React from "react";
import DetailedMetricItem from "./DetailedMetricItem";
import ScoreGauge from "./ScoreGauge";

// Este é o nosso novo componente de "tela cheia"
const WoorankDetailPage = ({ data, onBack }) => {
  // Uma verificação de segurança para o caso de os dados não terem sido carregados
  if (!data || !data.details) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast text-center">
        <p className="text-[var(--text-secondary)]">
          Não foi possível carregar os detalhes do Woorank.
        </p>
        <button
          onClick={onBack}
          className="mt-4 main-button px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg"
        >
          &larr; Voltar
        </button>
      </div>
    );
  }

  const { score, details } = data;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast">
      <header className="flex items-center justify-between mb-10 no-print">
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
          Relatório Detalhado de SEO (Woorank)
        </h1>
        <button
          onClick={onBack}
          className="main-button px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg"
        >
          &larr; Voltar ao Resumo
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda: O Score principal do Woorank e os Backlinks */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          <ScoreGauge score={score} title="Woorank SEO Score" />
          <section className="glass-pane p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Análise de Backlinks
            </h2>
            <div className="space-y-3">
              <DetailedMetricItem
                status={details.backlinks.count > 10 ? "good" : "warning"}
                label="Total de Backlinks"
                value={details.backlinks.count}
                explanation="Número de outros sites que apontam para o seu."
              />
            </div>
          </section>
        </div>

        {/* Coluna Direita: Os detalhes On-Page, Mobile e Tecnologias */}
        <div className="lg:col-span-2 space-y-8">
          <section className="glass-pane p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Análise On-Page
            </h2>
            <div className="space-y-3">
              <DetailedMetricItem
                status="good"
                label="Título da Página"
                value={details.onPage.title}
                explanation="O conteúdo da tag <title>."
              />
              <DetailedMetricItem
                status="good"
                label="Meta Descrição"
                value={details.onPage.metaDescription}
                explanation="O conteúdo da tag <meta name='description'>."
              />
              <DetailedMetricItem
                status="good"
                label="Cabeçalhos (H1/H2)"
                value={`${details.onPage.headings.h1} / ${details.onPage.headings.h2}`}
                explanation="A estrutura de títulos da página."
              />
            </div>
          </section>

          <section className="glass-pane p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Usabilidade Mobile
            </h2>
            <div className="space-y-3">
              <DetailedMetricItem
                status={details.mobile.isResponsive ? "good" : "bad"}
                label="Design Responsivo"
                value={details.mobile.isResponsive ? "Sim" : "Não"}
                explanation="O site adapta-se a diferentes tamanhos de ecrã."
              />
              <DetailedMetricItem
                status="good"
                label="Facilidade de Toque"
                value={details.mobile.touchscreenReadiness}
                explanation="Os botões e links são fáceis de tocar."
              />
            </div>
          </section>

          <section className="glass-pane p-6">
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              Tecnologias Utilizadas
            </h2>
            <div className="flex flex-wrap gap-2">
              {details.technologies.map((tech) => (
                <span
                  key={tech}
                  className="bg-white/10 text-[var(--text-secondary)] font-semibold px-3 py-1 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WoorankDetailPage;
