"use client";

import React, { useState, useEffect } from "react";
import "./animations.css";
import HomePage from "@/components/analysis/HomePage";
import LoadingPage from "@/components/analysis/LoadingPage";
import ReportPage from "@/components/analysis/ReportPage";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { XCircleIcon } from "@/components/ui/Icons";

// O componente de estilos permanece o mesmo.
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
  `}</style>
);

export default function App() {
  const [theme, setTheme] = useState("dark");
  const [appState, setAppState] = useState("home");
  const [reportData, setReportData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  // Adicionamos um novo estado para controlar a estratégia (mobile/desktop)
  const [strategy, setStrategy] = useState("mobile");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleAnalyze = async (url, selectedStrategy) => {
    setAppState("loading");
    setErrorMessage("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, strategy: selectedStrategy }),
      });

      // --- NOVO CÓDIGO DE DEPURAÇÃO ---
      // Primeiro, verificamos se a resposta da rede foi bem-sucedida (status 2xx)
      if (!response.ok) {
        // Se não foi, tentamos ler a resposta como texto, pois pode ser um erro HTML
        const errorText = await response.text();
        console.error("Falha na resposta da API. Status:", response.status);
        console.error("Corpo do erro (não-JSON):", errorText);
        // Lançamos um erro mais descritivo
        throw new Error(
          `O servidor respondeu com um erro: ${response.status}. Verifique o console para mais detalhes.`
        );
      }

      // Só tentamos converter para JSON se a resposta for 'ok'
      const data = await response.json();
      console.log(
        "PASSO 2 - DADOS RECEBIDOS NO NAVEGADOR (JSON VÁLIDO):",
        data
      );

      setReportData(data);
      setAppState("report");
    } catch (error) {
      // Agora o catch vai pegar nosso erro mais detalhado
      console.error("ERRO FINAL CAPTURADO PELO CATCH:", error);
      setErrorMessage(error.message);
      setAppState("error");
    }
  };

  const handleReset = () => {
    setAppState("home");
    setReportData(null);
  };

  const renderContent = () => {
    switch (appState) {
      case "loading":
        return <LoadingPage />;
      case "report":
        return <ReportPage data={reportData} onReset={handleReset} />;
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
          // Passamos o estado da estratégia e a função para o alterar para a HomePage
          <HomePage
            onAnalyze={handleAnalyze}
            isLoading={appState === "loading"}
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
