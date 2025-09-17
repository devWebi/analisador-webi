import React from "react";

/**
 * Um componente de "badge" para exibir nomes de tecnologias ou outras etiquetas.
 * @param {{name: string}} props - As propriedades do componente.
 * @returns {JSX.Element}
 */
const TechnologyBadge = ({ name }) => {
  return (
    <span className="inline-block bg-white/10 text-[var(--text-secondary)] text-sm font-mono px-3 py-1 rounded-full whitespace-nowrap">
      {name}
    </span>
  );
};

export default TechnologyBadge;
