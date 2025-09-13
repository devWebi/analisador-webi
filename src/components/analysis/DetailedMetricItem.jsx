import React from "react";
import { CheckCircleIcon, AlertTriangleIcon, XCircleIcon } from "../ui/Icons";

// Um novo componente para exibir cada linha do nosso relatório detalhado.
const DetailedMetricItem = ({ status, label, value, explanation }) => {
  // Mapeamento para escolher o ícone e a cor do texto com base no estado (status)
  const statusConfig = {
    good: { icon: <CheckCircleIcon />, color: "text-emerald-400" },
    warning: { icon: <AlertTriangleIcon />, color: "text-amber-400" },
    bad: { icon: <XCircleIcon />, color: "text-red-400" },
  };

  const { icon, color } = statusConfig[status] || {
    icon: null,
    color: "text-[var(--text-primary)]",
  };

  return (
    <div className="p-4 bg-[var(--insight-bg)] rounded-lg flex items-center gap-4 transition hover:bg-white/5">
      <div className="flex-shrink-0 w-6 h-6">{icon}</div>
      <div className="flex-grow">
        <p className="font-bold text-[var(--text-primary)]">{label}</p>
        <p className="text-sm text-[var(--text-secondary)]">{explanation}</p>
      </div>
      <div className={`text-lg font-bold flex-shrink-0 ${color}`}>{value}</div>
    </div>
  );
};

export default DetailedMetricItem;
