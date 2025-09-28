import React, { useState, useEffect } from "react";

// Função para obter as cores e o texto com base na pontuação (mantida)
const getScoreStyle = (score) => {
  if (score >= 90) {
    return {
      text: "Excelente",
      colorClass: "text-green-500",
      colorValue: "#22c55e",
    };
  }
  if (score >= 50) {
    return {
      text: "Razoável",
      colorClass: "text-orange-400",
      colorValue: "#fb923c",
    };
  }
  return {
    text: "Lento",
    colorClass: "text-red-500",
    colorValue: "#ef4444",
  };
};

const ScoreGauge = ({ score, title }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const { text: contextText, colorClass, colorValue } = getScoreStyle(score);

  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  // O offset final para a animação do círculo
  const finalOffset = circumference - (score / 100) * circumference;

  // Estado para controlar o offset do círculo para a animação
  const [strokeOffset, setStrokeOffset] = useState(circumference);

  // Hook para controlar as animações quando o componente é montado
  useEffect(() => {
    // Animação do círculo
    // Damos um pequeno atraso para garantir que a transição CSS é aplicada
    const circleTimer = setTimeout(() => {
      setStrokeOffset(finalOffset);
    }, 100);

    // Animação do contador de números
    let startTime;
    const animationDuration = 1500; // 1.5 segundos

    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsedTime = timestamp - startTime;
      const progress = Math.min(elapsedTime / animationDuration, 1);

      // Easing function (ease-out) para uma animação mais suave
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentScore = Math.round(easedProgress * score);

      setDisplayScore(currentScore);

      if (elapsedTime < animationDuration) {
        requestAnimationFrame(animateCount);
      } else {
        // Garante que o valor final é exato
        setDisplayScore(score);
      }
    };

    requestAnimationFrame(animateCount);

    // Limpa o temporizador se o componente for desmontado
    return () => clearTimeout(circleTimer);
  }, [score, finalOffset]);

  return (
    // O card agora tem uma transição de escala ao passar o rato
    <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 glass-pane text-center shadow-2xl h-full transition-transform duration-300 hover:scale-105">
      <p className="font-semibold text-[var(--text-secondary)] uppercase tracking-widest text-xs sm:text-sm mb-2">
        {title}
      </p>
      {/* Container do SVG agora é responsivo */}
      <div className="relative w-full aspect-square max-w-[150px] mx-auto">
        <svg className="w-full h-full" viewBox="0 0 120 120">
          {/* Círculo de fundo */}
          <circle
            strokeWidth="8"
            stroke="rgba(128, 128, 128, 0.3)"
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
          />
          {/* Círculo de progresso animado */}
          <circle
            strokeWidth="8"
            strokeLinecap="round"
            stroke={colorValue}
            fill="transparent"
            r={radius}
            cx="60"
            cy="60"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeOffset, // Usamos o estado para animar
              transition:
                "stroke-dashoffset 1.5s cubic-bezier(0.65, 0, 0.35, 1), stroke 0.5s",
              // ALTERAÇÃO: Brilho do círculo reduzido
              filter: `drop-shadow(0 0 3px ${colorValue})`,
            }}
            transform="rotate(-90 60 60)"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-4xl sm:text-5xl font-bold font-mono"
          style={{
            color: colorValue,
            // ALTERAÇÃO: Brilho do texto reduzido
            textShadow: `0 0 4px ${colorValue}`,
          }}
        >
          {displayScore}
        </span>
      </div>
      <p className={`mt-3 font-bold text-base sm:text-lg ${colorClass}`}>
        {contextText}
      </p>
    </div>
  );
};

export default ScoreGauge;
