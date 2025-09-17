import { NextResponse } from "next/server";
import axios from "axios";

// --- FUNÇÃO REAL PARA BUSCAR DADOS DO GOOGLE PAGESPEED ---
// Mantemos a sua função, que já está perfeita e pede os dados em pt-BR.
async function fetchPageSpeedData(url, apiKey, strategy) {
  if (!apiKey)
    throw new Error(
      "A chave de API do Google não foi configurada no servidor."
    );

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&locale=pt-BR`;

  console.log(`A chamar a API do Google para ${strategy} em Português...`);
  const response = await axios.get(apiUrl);
  if (!response.data || !response.data.lighthouseResult)
    throw new Error("A API do Google devolveu uma resposta inesperada.");

  return response.data.lighthouseResult;
}

// Mantemos a sua função de análise do Gemini, que é robusta.
async function analyzeWithGemini(pageSpeedData, apiKey) {
  if (!apiKey) throw new Error("A chave de API do Gemini não foi configurada.");

  const { categories, audits } = pageSpeedData;
  const dataForAnalysis = {
    scores: {
      performance: Math.round(categories.performance.score * 100),
      seo: Math.round(categories.seo.score * 100),
    },
    keyMetrics: {
      lcp: audits["largest-contentful-paint"]?.displayValue,
      cls: audits["cumulative-layout-shift"]?.displayValue,
    },
    opportunitiesSample: Object.values(audits)
      .filter(
        (audit) =>
          audit.details?.type === "opportunity" &&
          audit.score !== null &&
          audit.score < 1
      )
      .map((audit) => audit.title)
      .slice(0, 5),
  };

  const prompt = `
  **PERSONA:**
Você é o Agente Webi, um consultor de performance web de classe mundial. Sua comunicação é clara, precisa e focada em gerar valor para o cliente.

**CONTEXTO:**
O seu cliente é o dono de um site e pode não ter conhecimento técnico aprofundado. O relatório deve ser compreensível para ele, mas também útil para uma equipe de desenvolvimento. Conecte as métricas técnicas a possíveis impactos no negócio (ex: "A lentidão no LCP pode estar aumentando a taxa de rejeição e diminuindo as conversões").

**TAREFA:**
Analise os dados brutos do Google PageSpeed fornecidos abaixo. Com base neles, gere um relatório de diagnóstico aprofundado, seguindo estritamente a estrutura de formato de saída.

**DADOS BRUTOS:**
\`\`\`json
${JSON.stringify(dataForAnalysis, null, 2)}
\`\`\`

**ESTRUTURA DE SAÍDA OBRIGATÓRIA (Use Markdown e português do Brasil):**

### Veredito do Especialista
(Um resumo executivo e direto sobre o estado geral do site em 2-3 frases.)

### Análise Detalhada por Pilar
### 🚀 Performance
(Análise do score de performance e das métricas chave como LCP, FCP, CLS. Explique o que cada uma significa em termos simples.)

### 🔍 SEO
(Comentários sobre o score de SEO e fatores importantes que estão impactando a visibilidade nos mecanismos de busca.)

### Principais Oportunidades
(Uma lista com marcadores (bullets) das 3 a 5 oportunidades de melhoria mais impactantes encontradas nos dados.)

### Plano de Ação Priorizado
(Uma lista numerada de 3 a 5 ações prioritárias. Siga o formato exato abaixo para cada item, usando negrito para os subtítulos e quebras de linha entre eles.)

1. **Problema:** Descreva o problema de forma clara e concisa.
   **Impacto:** Explique o impacto negativo que este problema causa na experiência do usuário ou nos resultados do negócio.
   **Solução:** Descreva a ação a ser tomada. Se for técnica, forneça um resumo para o desenvolvedor e uma explicação simples do benefício para o dono do site.

2. **Problema:** ...
   **Impacto:** ...
   **Solução:** ...
   (e assim por diante)

### Conclusão e Próximos Passos
(Um parágrafo final encorajador, resumindo o potencial de melhoria e sugerindo os próximos passos imediatos.)

**NOTA FINAL:**
Seja objetivo e evite jargões. A clareza e a capacidade de ação do relatório são suas maiores prioridades. Foque no que é mais relevante para o dono do site.
`;
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  let retries = 5;
  let delay = 2000;

  for (let i = 0; i < retries; i++) {
    try {
      console.log(
        `A enviar dados para o Gemini... (Tentativa ${i + 1} de ${retries})`
      );
      const response = await axios.post(geminiApiUrl, {
        contents: [{ parts: [{ text: prompt }] }],
      });
      console.log("Análise do Gemini recebida com sucesso.");
      if (response.data.candidates && response.data.candidates.length > 0) {
        return response.data.candidates[0].content.parts[0].text;
      } else {
        throw new Error("A API do Gemini retornou uma resposta vazia.");
      }
    } catch (error) {
      if (error.response && error.response.status === 503) {
        if (i < retries - 1) {
          console.warn(
            `API do Gemini sobrecarregada. A tentar novamente em ${
              delay / 1000
            }s...`
          );
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2;
        } else {
          throw new Error("O assistente de IA está sobrecarregado no momento.");
        }
      } else {
        throw error;
      }
    }
  }
}

export async function POST(request) {
  try {
    const { url, strategy } = await request.json();
    if (!url || !strategy)
      return NextResponse.json(
        { message: "URL e estratégia são obrigatórias." },
        { status: 400 }
      );

    const { GOOGLE_PAGESPEED_API_KEY, GEMINI_API_KEY } = process.env;

    const pageSpeedData = await fetchPageSpeedData(
      url,
      GOOGLE_PAGESPEED_API_KEY,
      strategy
    );

    let geminiAnalysis =
      "### Análise Indisponível\n\nO nosso assistente de IA está temporariamente indisponível.";
    try {
      geminiAnalysis = await analyzeWithGemini(pageSpeedData, GEMINI_API_KEY);
    } catch (geminiError) {
      console.warn(
        "AVISO: A análise do Gemini falhou, mas o relatório continuará.",
        geminiError.message
      );
    }

    const { audits, categories } = pageSpeedData; // Simplificado, não precisamos de categoryGroups aqui

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

    // O código para extrair o plano de ação do texto do Gemini está um pouco complexo.
    // O ideal é que o Gemini retorne um JSON, mas por enquanto, vamos simplificar
    // e deixar o frontend separar a análise do plano de ação.
    const actionPlan = []; // Deixando para o frontend lidar com isso por enquanto. // --- CORREÇÃO FINAL E ADIÇÃO DAS MÉTRICAS DETALHADAS ---

    const relatorioFinal = {
      url,
      strategy,
      performanceScore: Math.round(categories.performance.score * 100),
      seoScore: Math.round(categories.seo.score * 100),
      accessibilityScore: Math.round(categories.accessibility.score * 100),
      bestPracticesScore: Math.round(categories["best-practices"].score * 100),

      detailedMetrics: {
        lcp:
          parseFloat(
            (audits["largest-contentful-paint"]?.numericValue / 1000)?.toFixed(
              2
            )
          ) || 0,
        cls:
          parseFloat(
            audits["cumulative-layout-shift"]?.numericValue?.toFixed(2)
          ) || 0,
        fcp:
          parseFloat(
            (audits["first-contentful-paint"]?.numericValue / 1000)?.toFixed(2)
          ) || 0,
        speedIndex:
          parseFloat(
            (audits["speed-index"]?.numericValue / 1000)?.toFixed(2)
          ) || 0,
        tti:
          parseFloat(
            (audits["interactive"]?.numericValue / 1000)?.toFixed(2)
          ) || 0,
        ttfb:
          parseFloat(
            (audits["server-response-time"]?.numericValue / 1000)?.toFixed(2)
          ) || 0,
      },

      geminiAnalysis,
      actionPlan,
      opportunities,
      diagnostics,
    };
    console.log(
      "PASSO 1 - OBJETO FINAL ENVIADO DO SERVIDOR:",
      JSON.stringify(relatorioFinal, null, 2)
    );
    return NextResponse.json(relatorioFinal);
  } catch (error) {
    console.error("Erro no backend:", error.message);
    const userMessage = error.response?.data?.error?.message || error.message;
    return NextResponse.json(
      { message: `Erro ao analisar: ${userMessage}` },
      { status: 500 }
    );
  }
}
