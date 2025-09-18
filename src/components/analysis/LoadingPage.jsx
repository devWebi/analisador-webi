import React, { useState, useEffect } from "react";

const LoadingPage = () => {
  const messages = [
    "Invocando robôs de análise...",
    "Medindo a velocidade da luz...",
    "Consultando os mestres do conhecimento...",
    "Compilando o relatório de poder...",
  ];
  const [message, setMessage] = useState(messages[0]);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setMessage(messages[i]);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center z-10 animate-fade-in">
      <div className="loader"></div>
      <p className="mt-8 text-xl text-[var(--text-primary)] font-semibold tracking-wider">
        {message}
      </p>
    </div>
  );
};

export default LoadingPage;
