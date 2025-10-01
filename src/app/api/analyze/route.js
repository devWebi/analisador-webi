import { NextResponse } from "next/server";
import axios from "axios";
import Groq from "groq-sdk";

async function fetchPageSpeedData(url, apiKey, strategy) {
  if (!apiKey) {
    throw new Error(
      "A chave de API do Google não foi configurada no servidor."
    );
  }

  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=${strategy}&category=performance&category=seo&category=best-practices&category=accessibility&locale=pt-BR`;

  console.log(
    `[ETAPA 1/5] A chamar a API do Google PageSpeed para ${strategy}...`
  );
  const response = await axios.get(apiUrl);
  if (!response.data || !response.data.lighthouseResult) {
    throw new Error("A API do Google devolveu uma resposta inesperada.");
  }
  console.log("[ETAPA 1/5] Dados do PageSpeed recebidos com sucesso.");
  return response.data.lighthouseResult;
}

export async function POST(request) {
  try {
    const { url, strategy } = await request.json();
    if (!url || !strategy) {
      return NextResponse.json(
        { message: "URL e estratégia são obrigatórias." },
        { status: 400 }
      );
    }

    const { GOOGLE_PAGESPEED_API_KEY, GROQ_API_KEY } = process.env;

    const pageSpeedData = await fetchPageSpeedData(
      url,
      GOOGLE_PAGESPEED_API_KEY,
      strategy
    );

    let analysisResult =
      "### Análise Indisponível\n\nO nosso assistente de IA está temporariamente indisponível.";
    try {
      console.log("\n[ETAPA 2/5] Iniciando a análise com a API da Groq...");

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

        **ESTRUTURA DE SAÍDA OBRIGATÓRIA (Use Markdown e português do Brasil) :**
        **SEJA EXTREMAMENTE RIGOROSO:** A sua resposta final deve conter **EXATAMENTE** o conteúdo abaixo, sem qualquer texto adicional, introduções, comentários, ou blocos de pensamento (<think>...</think>) para nao estragar a esperiência do usuário da aplicação.

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

      const groq = new Groq({ apiKey: GROQ_API_KEY });

      console.log(
        "[ETAPA 3/5] A procurar pelo melhor modelo de chat disponível na Groq..."
      );
      const models = await groq.models.list();
      const availableModels = models.data.filter(
        (m) => m.active && !m.id.includes("whisper")
      );

      let bestModel = availableModels.find((m) => m.id.includes("70b"));
      if (!bestModel) {
        bestModel =
          availableModels.find(
            (m) => !m.id.includes("guard") && !m.id.includes("maverick")
          ) || availableModels[0];
      }

      if (!bestModel) {
        throw new Error(
          "Não foi encontrado nenhum modelo de chat de geração de conteúdo ativo na sua conta Groq."
        );
      }
      const modelId = bestModel.id;
      console.log(`[ETAPA 3/5] Modelo de excelência selecionado: ${modelId}.`);

      console.log(
        `[ETAPA 4/5] A enviar prompt para o modelo da Groq: ${modelId}...`
      );
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
      });

      const respostaBrutaDaIa =
        chatCompletion.choices[0]?.message?.content || "";

      analysisResult = respostaBrutaDaIa
        .replace(/<think>[\s\S]*?<\/think>/, "")
        .trim();

      console.log("[ETAPA 4/5] Análise da Groq recebida e LIMPA com sucesso.");
    } catch (apiError) {
      //...
      console.error("\nERRO DETALHADO AO CHAMAR A API DE IA:", apiError);
      console.warn(
        "AVISO: A análise de IA falhou. O relatório continuará com a mensagem padrão."
      );
    }

    console.log(
      "\n[ETAPA 5/5] A montar o relatório final para enviar ao frontend..."
    );
    const { audits, categories } = pageSpeedData;
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
      geminiAnalysis: analysisResult,
      actionPlan: [],
      opportunities,
      diagnostics,
    };

    console.log("[ETAPA 5/5] Relatório final pronto. A enviar resposta...");
    return NextResponse.json(relatorioFinal);
  } catch (error) {
    console.error("\nERRO CRÍTICO NO ENDPOINT:", error.message);
    const userMessage = error.response?.data?.error?.message || error.message;
    return NextResponse.json(
      { message: `Erro ao analisar: ${userMessage}` },
      { status: 500 }
    );
  }
}
