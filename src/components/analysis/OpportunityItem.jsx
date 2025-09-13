import React from "react";
import { AlertTriangleIcon } from "../ui/Icons";

// Este componente exibe um único item da lista de "Oportunidades".
const OpportunityItem = ({ opportunity }) => {
  return (
    <div className="p-4 bg-[var(--insight-bg)] rounded-lg flex items-start gap-4 transition hover:bg-white/5">
      <div className="flex-shrink-0 w-6 h-6 mt-1">
        <AlertTriangleIcon className="text-amber-400" />
      </div>
      <div>
        <p className="font-bold text-[var(--text-primary)] flex items-center gap-2">
          {opportunity.title}
          {opportunity.savings && (
            <span className="text-xs font-mono bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">
              {opportunity.savings}
            </span>
          )}
        </p>
        {/* Usamos dangerouslySetInnerHTML para renderizar o markdown simples que a API envia */}
        <p
          className="text-sm text-[var(--text-secondary)]"
          dangerouslySetInnerHTML={{ __html: opportunity.description }}
        ></p>
      </div>
    </div>
  );
};

export default OpportunityItem;
