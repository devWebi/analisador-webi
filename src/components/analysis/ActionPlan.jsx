import React from "react";
import { XCircleIcon, AlertTriangleIcon, CheckCircleIcon } from "../ui/Icons";

// Mapeamento para dar estilo a cada tipo de prioridade do plano de ação
const priorityConfig = {
  high: {
    label: "Alta Prioridade",
    icon: <XCircleIcon className="text-red-400" />,
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  medium: {
    label: "Média Prioridade",
    icon: <AlertTriangleIcon className="text-amber-400" />,
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
  },
  low: {
    label: "Baixa Prioridade",
    icon: <CheckCircleIcon className="text-sky-400" />,
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
  },
};

const ActionPlan = ({ items }) => {
  // Se não houver itens no plano de ação, exibimos uma mensagem de sucesso.
  if (!items || items.length === 0) {
    return (
      <div className="text-center p-8 bg-[var(--insight-bg)] rounded-lg">
        <CheckCircleIcon className="mx-auto text-emerald-500 w-12 h-12" />
        <h4 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
          Tudo em Ordem!
        </h4>
        <p className="text-[var(--text-secondary)]">
          Não encontrámos itens de ação de alta prioridade.
        </p>
      </div>
    );
  }

  // Se houver itens, mapeamo-los para exibir cada um.
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const config = priorityConfig[item.priority] || {};
        return (
          <div
            key={index}
            className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor}`}
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">{config.icon}</div>
              <h4 className="font-bold text-[var(--text-primary)]">
                {config.label}
              </h4>
            </div>
            <p className="mt-2 ml-9 text-[var(--text-secondary)]">
              {item.text}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default ActionPlan;
