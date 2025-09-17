import React from "react";

// Função para converter o tempo em segundos para uma nota (A-F)
const getMetricGrade = (value, thresholds) => {
  if (value <= thresholds.good) return { grade: "A", color: "bg-emerald-500" };
  if (value <= thresholds.needsImprovement)
    return { grade: "C", color: "bg-amber-500" };
  return { grade: "F", color: "bg-red-500" };
};

// Componente para um único item do painel
const SummaryItem = ({ label, value, unit, thresholds }) => {
  const { grade, color } = getMetricGrade(value, thresholds);

  return (
    <div className="glass-pane p-4 rounded-lg flex items-center justify-between">
      <span className="font-semibold text-[var(--text-secondary)]">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="font-bold text-lg text-[var(--text-primary)]">
          {value}
          {unit}
        </span>
        <span
          className={`flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm ${color}`}
        >
          {grade}
        </span>
      </div>
    </div>
  );
};

// O painel principal que agrupa todos os itens
const PerformanceSummary = ({ metrics }) => {
  if (!metrics) return null;

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Performance em Detalhe
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryItem
          label="First Contentful Paint"
          value={metrics.fcp}
          unit="s"
          thresholds={{ good: 1.8, needsImprovement: 3.0 }}
        />
        <SummaryItem
          label="Speed Index"
          value={metrics.speedIndex}
          unit="s"
          thresholds={{ good: 3.4, needsImprovement: 5.8 }}
        />
        <SummaryItem
          label="Largest Contentful Paint"
          value={metrics.lcp}
          unit="s"
          thresholds={{ good: 2.5, needsImprovement: 4.0 }}
        />
        <SummaryItem
          label="Time to Interactive"
          value={metrics.tti}
          unit="s"
          thresholds={{ good: 3.8, needsImprovement: 7.3 }}
        />
        <SummaryItem
          label="Time to First Byte"
          value={metrics.ttfb}
          unit="s"
          thresholds={{ good: 0.8, needsImprovement: 1.8 }}
        />
        <SummaryItem
          label="Cumulative Layout Shift"
          value={metrics.cls}
          unit=""
          thresholds={{ good: 0.1, needsImprovement: 0.25 }}
        />
      </div>
    </section>
  );
};

export default PerformanceSummary; // Se houver itens, mapeamo-los para exibir cada um. ESSE É O QUE FUNCIONA MESMO
