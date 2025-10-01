import React from "react";
import {
  LightbulbIcon2,
  ArrowRightIcon,
  ChatIcon,
  TimerIcon,
} from "@/components/ui/Icons";
const ActionPlan = ({ onNavigate }) => {
  return (
    // Container com animação de brilho pulsante na borda para dar "vida"
    <div className="bg-white/5 p-8 rounded-2xl border border-[var(--accent-color)]/50 text-center flex flex-col items-center shadow-2xl shadow-[var(--accent-color)]/10 animate-pulse-slow">
      <div className="mb-4">
        <LightbulbIcon2 />
      </div>

      <h3 className="text-2xl font-bold text-[var(--text-primary)]">
        Desbloquear o Próximo Nível
      </h3>

      <p className="mt-2 mb-6 text-[var(--text-secondary)] max-w-md">
        A performance é só o começo. Descubra como a psicologia do design pode
        otimizar a jornada do seu cliente e impulsionar as suas conversões.
      </p>

      <button
        onClick={onNavigate}
        className="main-button inline-flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black text-lg font-bold rounded-lg transform hover:scale-105 transition-transform duration-300 shadow-lg shadow-[var(--accent-color)]/30"
      >
        Analisar UI/UX
        <ArrowRightIcon />
      </button>
      <p className="text-[var(--text-secondary)] my-6 text-sm">ou</p>

      <a
        href="https://webi.com.br/contato/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:scale-105 transition-transform duration-300 shadow-lg"
      >
        <ChatIcon />
        Fale com um Especialista
      </a>
    </div>
  );
};

export default ActionPlan;
