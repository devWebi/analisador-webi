import { NextResponse } from "next/server";
import axios from "axios";

// --- FUNÇÃO REAL PARA BUSCAR DADOS DO GOOGLE PAGESPEED ---
async function fetchPageSpeedData(url, apiKey, strategy) {
  if (!apiKey)
    throw new Error(
      "A chave de API do Google não foi configurada no servidor."
    );

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility`;

  console.log(`A chamar a API do Google para ${strategy}...`);
  const response = await axios.get(apiUrl);
  if (!response.data || !response.data.lighthouseResult)
    throw new Error("A API do Google devolveu uma resposta inesperada.");

  const { audits, categories } = response.data.lighthouseResult;

  // --- A "REDE DE ARRASTO" - LÓGICA DE EXTRAÇÃO CORRIGIDA ---
  const allAudits = Object.values(audits);

  const opportunities = allAudits
    .filter(
      (audit) =>
        audit.details?.type === "opportunity" &&
        audit.score !== null &&
        audit.score < 1
    )
    .map((audit) => ({
      title: audit.title,
      description: audit.description,
      savings: audit.details?.overallSavingsMs
        ? `${Math.round(audit.details.overallSavingsMs / 100) / 10}s`
        : audit.details?.overallSavingsBytes
        ? `${Math.round(audit.details.overallSavingsBytes / 1024)} KB`
        : null,
    }));

  const diagnostics = allAudits
    .filter(
      (audit) =>
        audit.details?.type === "table" &&
        audit.score !== null &&
        audit.score < 1 &&
        !opportunities.some((op) => op.title === audit.title)
    )
    .map((audit) => ({
      title: audit.title,
      description: audit.description,
      savings: null,
    }));

  return {
    performanceScore: Math.round(categories.performance.score * 100),
    seoScore: Math.round(categories.seo.score * 100),
    accessibilityScore: Math.round(categories.accessibility.score * 100),
    bestPracticesScore: Math.round(categories["best-practices"].score * 100),
    coreWebVitals: {
      lcp:
        (audits["largest-contentful-paint"]?.numericValue / 1000)?.toFixed(2) ||
        "N/A",
      cls: audits["cumulative-layout-shift"]?.numericValue?.toFixed(2) || "N/A",
    },
    opportunities,
    diagnostics,
  };
}

export async function POST(request) {
  try {
    const { url, strategy } = await request.json();
    if (!url || !strategy)
      return NextResponse.json(
        { message: "URL e estratégia são obrigatórias." },
        { status: 400 }
      );

    const { GOOGLE_PAGESPEED_API_KEY } = process.env;
    const pageSpeedData = await fetchPageSpeedData(
      url,
      GOOGLE_PAGESPEED_API_KEY,
      strategy
    );

    // O plano de ação é construído a partir de TODAS as oportunidades REAIS
    const actionPlan = pageSpeedData.opportunities
      // A CORREÇÃO ESTÁ AQUI: Removemos o .slice(0, 3)
      .map((op) => ({
        priority: "medium",
        text: `${op.title}. ${
          op.savings ? `Pode poupar aproximadamente ${op.savings}.` : ""
        }`,
      }));

    if (pageSpeedData.coreWebVitals.lcp > 2.5) {
      actionPlan.unshift({
        priority: "high",
        text: `O LCP de ${pageSpeedData.coreWebVitals.lcp}s é lento. Otimize a imagem principal.`,
      });
    }

    const relatorioFinal = {
      url,
      strategy,
      geralScore: Math.round(
        (pageSpeedData.performanceScore +
          pageSpeedData.seoScore +
          pageSpeedData.accessibilityScore) /
          3
      ),
      ...pageSpeedData,
      actionPlan, // Agora, esta é a lista completa.
    };

    return NextResponse.json(relatorioFinal);
  } catch (error) {
    console.error("Erro no backend:", error);
    const userMessage = error.response?.data?.error?.message || error.message;
    return NextResponse.json(
      { message: `Erro ao analisar: ${userMessage}` },
      { status: 500 }
    );
  }
}
