import React from "react";
// Reutilizamos os nossos ícones existentes para manter a consistência visual.
import { XCircleIcon, AlertTriangleIcon } from "./Icons";

// Este componente exibe uma linha para cada problema de acessibilidade encontrado.
// A propriedade 'type' irá determinar se mostramos um ícone de erro ou de alerta.
const AccessibilityIssue = ({ type, description, count }) => {
  const isError = type === "error";

  // Escolhemos o ícone e a cor com base no tipo de problema.
  const icon = isError ? (
    <XCircleIcon className="text-red-400" />
  ) : (
    <AlertTriangleIcon className="text-amber-400" />
  );

  const countColor = isError ? "text-red-400" : "text-amber-400";

  return (
    <div className="flex items-start gap-4 p-3 bg-[var(--insight-bg)] rounded-lg">
      <div className="flex-shrink-0 w-6 h-6 mt-1">{icon}</div>
      <div className="flex-grow">
        <p className="font-semibold text-[var(--text-primary)]">
          {description}
        </p>
      </div>
      <div className={`flex-shrink-0 font-bold text-lg ${countColor}`}>
        {count}
      </div>
    </div>
  );
};

export default AccessibilityIssue;
