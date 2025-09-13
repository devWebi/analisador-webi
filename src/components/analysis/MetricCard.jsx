import React from "react";

// Este componente é um cartão reutilizável para exibir uma métrica específica.
// Ele é bem simples e recebe três propriedades (props):
// - 'label': O nome da métrica (ex: "LCP").
// - 'value': O valor da métrica (ex: 1.7).
// - 'unit': A unidade de medida, que é opcional (ex: "s").
const MetricCard = ({ label, value, unit = "" }) => (
  <div className="glass-pane p-4 rounded-2xl shadow text-center flex flex-col justify-center interactive-card">
    {/* O rótulo da métrica na parte superior */}
    <p className="text-sm text-[var(--text-secondary)] uppercase tracking-wider">
      {label}
    </p>
    {/* O valor da métrica, em destaque */}
    <p className="text-3xl font-bold text-[var(--text-primary)]">
      {value}
      {/* A unidade de medida, com um estilo um pouco menor e dentro de um <span> */}
      <span className="text-lg font-normal text-[var(--text-secondary)]">
        {unit}
      </span>
    </p>
  </div>
);

export default MetricCard;
