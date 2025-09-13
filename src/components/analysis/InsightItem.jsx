import React from "react";
// Importamos os ícones que este componente vai precisar da nossa "caixa de ferramentas".
import { XCircleIcon, AlertTriangleIcon, CheckCircleIcon } from "../ui/Icons";

// Este componente exibe um único item do "Plano de Ação".
// Ele recebe um objeto 'insight' como propriedade (prop), que contém o 'type' e o 'text'.
const InsightItem = ({ insight }) => {
  // Mapeamento para escolher a cor da borda com base no tipo de insight.
  const borderColors = {
    error: "border-l-red-500",
    warning: "border-l-amber-500",
    success: "border-l-emerald-500",
  };

  // Mapeamento para escolher o ícone correto com base no tipo de insight.
  const icons = {
    error: <XCircleIcon />,
    warning: <AlertTriangleIcon />,
    success: <CheckCircleIcon />,
  };

  return (
    <div
      // A classe da borda é selecionada dinamicamente a partir do nosso mapeamento.
      className={`flex items-start p-4 bg-[var(--insight-bg)] rounded-lg border-l-4 ${
        borderColors[insight.type]
      }`}
    >
      {/* O ícone correspondente é renderizado aqui. */}
      <div className="flex-shrink-0 mr-4 mt-1">{icons[insight.type]}</div>
      {/* O texto do insight. */}
      <p className="text-[var(--text-primary)]">{insight.text}</p>
    </div>
  );
};

export default InsightItem;
