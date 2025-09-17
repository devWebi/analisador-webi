// O componente principal da nossa nova tela
const UiUxAnalysisPage = ({ onBack }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setResults(null);
    setError("");

    try {
      const response = await fetch("/api/analyze-uiux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Ocorreu um erro na análise.");
      }
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 z-10 animate-fade-in-fast">
      <header className="flex items-center justify-between mb-10 no-print">
        <h1 className="text-4xl font-bold text-[var(--text-primary)]">
          Análise de Acessibilidade e Tecnologias
        </h1>
        <button
          onClick={onBack}
          className="main-button px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg"
        >
          &larr; Voltar ao Relatório Principal
        </button>
      </header>

      {/* Formulário de Análise */}
      <div className="glass-pane p-6 mb-8">
        <form
          onSubmit={handleAnalyze}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://seusite.com"
            required
            className="w-full px-5 py-4 bg-[var(--input-bg)] border-2 border-transparent rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-4 focus:ring-[var(--accent-color)]/50 focus:border-[var(--accent-color)] transition duration-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="main-button w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[var(--accent-color)] text-black font-bold rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            <SearchIcon />
            {isLoading ? "A analisar..." : "Analisar UI/UX"}
          </button>
        </form>
      </div>

      {/* Exibição condicional: Loading, Erro ou Resultados */}
      {isLoading && (
        <div className="text-center p-8">
          <div className="loader mx-auto"></div>
          <p className="mt-4 text-lg text-[var(--text-secondary)]">
            A consultar os especialistas... isto pode demorar um pouco.
          </p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 glass-pane">
          <XCircleIcon className="mx-auto w-12 h-12 text-red-400" />
          <h3 className="mt-4 text-xl font-bold text-[var(--text-primary)]">
            Ocorreu um Erro
          </h3>
          <p className="text-[var(--text-secondary)]">{error}</p>
        </div>
      )}

      {results && (
        <div id="ui-ux-report" className="space-y-8 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ScoreGauge
                score={results.accessibilityScore}
                title="Score de Acessibilidade"
              />
            </div>
            <div className="lg:col-span-2 glass-pane p-6">
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Análise do Especialista de IA
              </h2>
              <GeminiUiUxReport text={results.geminiAnalysis} />
            </div>
          </div>

          {/* Seção de Tecnologias (só renderiza se houver tecnologias) */}
          {results.technologies?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Tecnologias Detetadas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.technologies.map((tech, index) => (
                  <TechnologyBadge key={index} {...tech} />
                ))}
              </div>
            </section>
          )}

          {/* Seção de Acessibilidade (só renderiza se houver erros) */}
          {results.accessibility?.errors?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                Relatório de Acessibilidade
              </h2>
              <div className="space-y-3">
                {results.accessibility.errors.map((issue, index) => (
                  <AccessibilityIssue key={index} type="error" {...issue} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
