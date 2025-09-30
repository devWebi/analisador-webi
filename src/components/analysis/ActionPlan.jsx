import React from "react";

// A propriedade 'onNavigate' será a função que vem do page.js para mudar de tela.
const ActionPlan = ({ onNavigate }) => {
  return (
    // Usamos um fragmento para devolver os dois painéis como irmãos.
    <>
      <div className="text-center mt-6 p-6 glass-pane flex flex-col items-center">
        <h4 className="text-xl font-bold text-[var(--text-primary)]">
          Fazer análise de UI/UX:
        </h4>
        <div className="mt-4">
          {/* Este botão agora chama a função de navegação que recebemos como propriedade */}
          <button
            onClick={onNavigate}
            className="main-button flex items-center justify-center text-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-2xl"
          >
            Fazer Análise
          </button>
        </div>
      </div>
      <div className="text-center mt-6 p-6 glass-pane flex flex-col items-center">
        <p className="text-[var(--text-secondary)] mt-2 max-w-xl text-center text-sm">
          Entre em contato conosco, e agendaremos uma consultoria personalizada
          para discutir as melhores estratégias para o seu site. Clique abaixo
          para iniciar o contato.
        </p>
        <div className="mt-4">
          <a
            href="https://webi.com.br/contato/"
            target="_blank"
            rel="noopener noreferrer"
            className="main-button flex items-center justify-center text-center gap-2 px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-2xl"
          >
            Iniciar Contato
          </a>
        </div>
      </div>
    </>
  );
};

export default ActionPlan;
