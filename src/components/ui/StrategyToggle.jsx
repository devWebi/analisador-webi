import React from "react";
const StrategyToggle = ({ strategy, setStrategy }) => {
  return (
    <div className="relative flex w-full max-w-xs mx-auto items-center rounded-xl p-1 glass-pane">
      <span
        className="absolute top-1 left-1 h-[calc(100%-0.5rem)] w-[calc(50%-0.25rem)] rounded-lg bg-[var(--accent-color)] shadow-lg transition-transform duration-300 ease-in-out"
        style={{
          // A magia acontece aqui: movemos o fundo para a direita se 'desktop' estiver ativo.
          transform:
            strategy === "desktop" ? "translateX(100%)" : "translateX(0%)",
        }}
      />

      <button
        onClick={() => setStrategy("mobile")}
        className="relative z-10 flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none"
      >
        <span
          className={
            strategy === "mobile"
              ? "text-black"
              : "text-[var(--text-secondary)]"
          }
        >
          Mobile
        </span>
      </button>
      <button
        onClick={() => setStrategy("desktop")}
        className="relative z-10 flex-1 px-4 py-2 rounded-lg font-semibold transition-colors duration-300 focus:outline-none"
      >
        <span
          className={
            strategy === "desktop"
              ? "text-black"
              : "text-[var(--text-secondary)]"
          }
        >
          Desktop
        </span>
      </button>
    </div>
  );
};

export default StrategyToggle;
