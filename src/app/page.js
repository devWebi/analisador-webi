"use client";

import React, { useState, useEffect } from "react";
import "./animations.css";
import HomePage from "@/components/analysis/HomePage";
import LoadingPage from "@/components/analysis/LoadingPage";
import ReportPage from "@/components/analysis/ReportPage";
import UiUxAnalysisPage from "@/components/analysis/UiUxAnalysisPage";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { XCircleIcon } from "@/components/ui/Icons";

const ThemeStyles = () => (
  <style jsx="true" global="true">{`
    :root {
      --accent-color: #f17923;
    }
    .light {
      --text-primary: #0d1117;
      --text-secondary: #586069;
      --glass-bg: rgba(255, 255, 255, 0.6);
      --glass-border: rgba(0, 0, 0, 0.1);
      --input-bg: rgba(255, 255, 255, 0.2);
      --insight-bg: rgba(0, 0, 0, 0.02);
    }
    .dark {
      --text-primary: #e6edf3;
      --text-secondary: #8b949e;
      --glass-bg: rgba(10, 16, 26, 0.5);
      --glass-border: rgba(255, 255, 255, 0.1);
      --input-bg: rgba(0, 0, 0, 0.2);
      --insight-bg: rgba(0, 0, 0, 0.2);
    }
    .glass-pane {
      background: var(--glass-bg);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid var(--glass-border);
      border-radius: 1.5rem;
    }
    @media print {
      .no-print {
        display: none !important;
      }
      body {
        background: #fff !important;
      }
      .printable {
        color: #000 !important;
        background: #fff !important;
      }
    }
  `}</style>
);

export default function App() {
  // O estado inicial agora é 'null' para que possamos detetá-lo
  const [theme, setTheme] = useState(null);
  const [appState, setAppState] = useState("home");
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [strategy, setStrategy] = useState("mobile");
  const [uiUxAnalysisData, setUiUxAnalysisData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- NOVO CÓDIGO PARA DETETAR O TEMA DO SISTEMA ---
  useEffect(() => {
    // Esta verificação só é feita na primeira vez que o componente carrega (quando o tema é null)
    if (theme === null) {
      if (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
    // Uma vez definido, o tema é aplicado ao corpo do documento
    if (theme) {
      document.body.className = theme;
    }
  }, [theme]);
  // --------------------------------------------------

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleAnalyze = async (url, selectedStrategy) => {
    setIsLoading(true);
    setAppState("loading");
    setErrorMessage("");
    setUiUxAnalysisData(null);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy: selectedStrategy }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `O servidor respondeu com um erro: ${response.status}. Detalhes: ${errorText}`
        );
      }
      const data = await response.json();
      setReportData(data);
      setAppState("report");
    } catch (error) {
      console.error("ERRO FINAL CAPTURADO PELO CATCH:", error);
      setErrorMessage(error.message);
      setAppState("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUiUxAnalyze = async (url) => {
    setIsLoading(true);
    setErrorMessage("");
    setUiUxAnalysisData(null);
    try {
      const response = await fetch("/api/analyze-uiux", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro desconhecido.");
      }
      setUiUxAnalysisData({ ...data, analyzedUrl: url });
    } catch (err) {
      setErrorMessage(
        err.message || "Não foi possível conectar ao servidor de análise."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAppState("home");
    setReportData(null);
    setUiUxAnalysisData(null);
  };

  const handleNavigateToUiUx = () => {
    setAppState("uiUxAnalysis");
  };

  const handleGoBackToReport = () => {
    setAppState("report");
  };

  const renderContent = () => {
    if (
      (isLoading && appState !== "report" && appState !== "uiUxAnalysis") ||
      theme === null
    ) {
      // Também mostra o ecrã de carregamento enquanto o tema está a ser detetado
      return <LoadingPage />;
    }

    switch (appState) {
      case "report":
        return (
          <ReportPage
            data={reportData}
            onReset={handleReset}
            onNavigateToUiUx={handleNavigateToUiUx}
          />
        );
      case "uiUxAnalysis":
        return (
          <UiUxAnalysisPage
            onAnalyze={handleUiUxAnalyze}
            analysisData={uiUxAnalysisData}
            isLoading={isLoading}
            error={errorMessage}
            onGoBack={handleGoBackToReport}
          />
        );
      case "error":
        return (
          <div className="text-center z-10 animate-fade-in">
            <XCircleIcon className="mx-auto text-red-500 w-16 h-16" />
            <h2 className="mt-4 text-2xl font-bold text-[var(--text-primary)]">
              Ocorreu um Erro
            </h2>
            <p className="mt-2 text-[var(--text-secondary)]">{errorMessage}</p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-[var(--accent-color)] text-black font-bold rounded-lg hover:brightness-110"
            >
              Tentar Novamente
            </button>
          </div>
        );
      default:
        return (
          <HomePage
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            strategy={strategy}
            setStrategy={setStrategy}
          />
        );
    }
  };

  return (
    <>
      <ThemeStyles />
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 overflow-hidden relative transition-colors duration-500 bg-animated">
        <div className="absolute inset-0 bg-dots no-print"></div>
        <div className="no-print">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
        {renderContent()}
      </main>
    </>
  );
}
