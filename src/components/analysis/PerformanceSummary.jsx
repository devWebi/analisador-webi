import React, { useState, useEffect } from "react";
// PASSO 1: Importar os ícones do novo ficheiro
import {
  PaintBrushIcon,
  TimerIcon,
  ImageIcon,
  ZapIcon,
  ServerIcon,
  LayersIcon,
} from "../ui/Icons"; // Ajuste o caminho se necessário

// Função para converter o tempo em segundos para uma nota (A-F)
const getMetricGrade = (value, thresholds) => {
  if (value <= thresholds.good)
    return { grade: "A", color: "bg-green-500/80 border-green-500/90" };
  if (value <= thresholds.needsImprovement)
    return { grade: "C", color: "bg-orange-500/80 border-orange-500/90" };
  return { grade: "F", color: "bg-red-500/80 border-red-500/90" };
};

// Componente para um único item do painel
const SummaryItem = ({
  icon,
  label,
  value,
  unit,
  thresholds,
  description,
  delay,
}) => {
  const { grade, color } = getMetricGrade(value, thresholds);
  const [displayValue, setDisplayValue] = useState("0.00");

  useEffect(() => {
    const startValue = 0;
    const endValue = value;
    if (endValue === 0) {
      setDisplayValue(endValue.toFixed(unit === "" ? 3 : 2));
      return;
    }

    let startTime;
    const animationDuration = 1200; // Duração base da animação

    const animateValue = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      const easedProgress = 1 - Math.pow(1 - progress, 4); // easeOutQuart

      const currentValue = startValue + easedProgress * (endValue - startValue);

      // O CLS tem valores pequenos, então precisa de mais precisão
      const decimalPlaces = unit === "" ? 3 : 2;
      setDisplayValue(currentValue.toFixed(decimalPlaces));

      if (progress < 1) {
        requestAnimationFrame(animateValue);
      } else {
        setDisplayValue(endValue.toFixed(decimalPlaces));
      }
    };

    // Aplica o atraso escalonado
    const timer = setTimeout(() => {
      requestAnimationFrame(animateValue);
    }, delay * 100);

    return () => clearTimeout(timer);
  }, [value, delay, unit]);

  return (
    <div
      title={description}
      className="glass-pane p-4 rounded-lg flex flex-col gap-4 transition-all duration-300 group hover:bg-white/5 hover:scale-[1.02] hover:shadow-lg hover:shadow-white/5 animate-fade-in"
      style={{ animationDelay: `${delay * 50}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[var(--accent-color)] w-6 h-6">{icon}</div>
          <span className="font-semibold text-[var(--text-secondary)]">
            {label}
          </span>
        </div>
        <span
          className={`flex items-center justify-center w-7 h-7 rounded-full text-white font-bold text-xs border ${color} transition-transform duration-300 group-hover:scale-110`}
        >
          {grade}
        </span>
      </div>
      <div className="text-right">
        <span className="font-bold text-3xl text-[var(--text-primary)] font-mono">
          {displayValue}
        </span>
        <span className="text-lg text-[var(--text-secondary)] font-mono ml-1">
          {unit}
        </span>
      </div>
    </div>
  );
};

// O painel principal que agrupa todos os itens
const PerformanceSummary = ({ metrics }) => {
  if (!metrics) return null;

  // Enriquecemos os dados das métricas com ícones e descrições para os tooltips
  const metricDetails = [
    {
      key: "fcp",
      label: "First Contentful Paint",
      value: metrics.fcp,
      unit: "s",
      thresholds: { good: 1.8, needsImprovement: 3.0 },
      icon: <PaintBrushIcon />,
      description:
        "Marca o tempo que o primeiro texto ou imagem é pintado no ecrã.",
    },
    {
      key: "speedIndex",
      label: "Speed Index",
      value: metrics.speedIndex,
      unit: "s",
      thresholds: { good: 3.4, needsImprovement: 5.8 },
      icon: <TimerIcon />,
      description:
        "Mede a rapidez com que o conteúdo é exibido visualmente durante o carregamento da página.",
    },
    {
      key: "lcp",
      label: "Largest Contentful Paint",
      value: metrics.lcp,
      unit: "s",
      thresholds: { good: 2.5, needsImprovement: 4.0 },
      icon: <ImageIcon />,
      description:
        "Mede o tempo de carregamento do maior elemento de conteúdo visível na janela de visualização.",
    },
    {
      key: "tti",
      label: "Time to Interactive",
      value: metrics.tti,
      unit: "s",
      thresholds: { good: 3.8, needsImprovement: 7.3 },
      icon: <ZapIcon />,
      description:
        "Mede o tempo que leva para uma página se tornar totalmente interativa.",
    },
    {
      key: "ttfb",
      label: "Time to First Byte",
      value: metrics.ttfb,
      unit: "s",
      thresholds: { good: 0.8, needsImprovement: 1.8 },
      icon: <ServerIcon />,
      description:
        "Mede o tempo que o navegador espera para receber o primeiro byte de dados do servidor.",
    },
    {
      key: "cls",
      label: "Cumulative Layout Shift",
      value: metrics.cls,
      unit: "",
      thresholds: { good: 0.1, needsImprovement: 0.25 },
      icon: <LayersIcon />,
      description:
        "Mede a estabilidade visual e quantifica a frequência com que os utilizadores experienciam mudanças inesperadas no layout.",
    },
  ];

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
        Performance em Detalhe
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* CORREÇÃO APLICADA AQUI */}
        {metricDetails.map(({ key, ...restOfMetric }, index) => (
          <SummaryItem key={key} {...restOfMetric} delay={index} />
        ))}
      </div>
    </section>
  );
};

export default PerformanceSummary;
