import React from "react";

// Este é um componente pequeno e reutilizável para exibir uma tecnologia.
const TechnologyBadge = ({ name, icon, version, website }) => {
  // A API do PageSpeed não nos dá um URL de ícone, apenas um nome.
  // Criamos um ícone de placeholder com as iniciais da tecnologia.
  const placeholderText = name.substring(0, 2).toUpperCase();

  return (
    // O componente inteiro é um link que abre o site da tecnologia numa nova aba, se disponível.
    <a
      href={website !== "#" ? website : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 glass-pane rounded-lg transition-all duration-300 hover:bg-white/10 interactive-card"
      title={website !== "#" ? `Visitar o site do ${name}` : name}
    >
      <div className="w-8 h-8 flex-shrink-0 bg-white/10 rounded-full flex items-center justify-center font-bold text-[var(--text-primary)]">
        {placeholderText}
      </div>
      <div>
        <p className="font-bold text-[var(--text-primary)]">{name}</p>
      </div>
    </a>
  );
};

export default TechnologyBadge;
