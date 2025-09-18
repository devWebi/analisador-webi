import React from "react";

// A função de contexto permanece a mesma
const getScoreContext = (score) => {
  if (score >= 90) return { text: "Excelente", color: "text-emerald-400" };
  if (score >= 50) return { text: "Razoável", color: "text-amber-400" };
  return { text: "Lento", color: "text-red-400" };
};

// Adicionamos as novas propriedades (props) 'onClick' e 'isClickable'
const ScoreGauge = ({ score, title, onClick, isClickable = false }) => {
  const color = "var(--accent-color)";
  const circumference = 2 * Math.PI * 55;
  const offset = circumference - (score / 100) * circumference;
  const { text: contextText, color: contextColor } = getScoreContext(score);

  // A classe base agora inclui 'group' para permitir o hover a partir do elemento pai
  // e 'interactive-card' (do nosso animations.css) se for clicável.
  const containerClasses = `relative flex flex-col items-center justify-center p-6 glass-pane text-center shadow-2xl h-full group ${
    isClickable ? "cursor-pointer interactive-card" : ""
  }`;

  // O conteúdo visual do componente
  const content = (
    <>
      <p className="font-semibold text-[var(--text-secondary)] uppercase tracking-widest text-sm mb-2">
        {title}
      </p>
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          <circle
            strokeWidth="10"
            stroke="rgba(128, 128, 128, 0.7)"
            fill="transparent"
            r="55"
            cx="60"
            cy="60"
          />
          <circle
            strokeWidth="10"
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r="55"
            cx="60"
            cy="60"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: "stroke-dashoffset 1s cubic-bezier(0.65, 0, 0.35, 1)",
              filter: `drop-shadow(0 0 5px ${color})`,
            }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-4xl font-bold"
          style={{ color: color, textShadow: `0 0 10px ${color}` }}
        >
          {score}
        </span>
      </div>
      <p className={`mt-3 font-bold text-lg ${contextColor}`}>{contextText}</p>
      {/* Este texto só aparece quando o card é clicável e o rato está por cima */}
      {isClickable && (
        <span className="absolute bottom-4 text-xs font-bold text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ver Detalhes
        </span>
      )}
    </>
  );

  // Se o componente for clicável, envolvemos o conteúdo num <button>
  // Se não, usamos uma <div> normal.
  return isClickable ? (
    <button onClick={onClick} className={containerClasses}>
      {content}
    </button>
  ) : (
    <div className={containerClasses}>{content}</div>
  );
};

export default ScoreGauge;
