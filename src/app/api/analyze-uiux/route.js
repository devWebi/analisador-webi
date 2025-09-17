import { NextResponse } from "next/server";
import axios from "axios";

// --- FUNÇÃO PARA BUSCAR DADOS DO PAGESPEED (REUTILIZADA E FOCADA) ---
async function fetchPageSpeedData(url, apiKey) {
  if (!apiKey) throw new Error("A chave de API do Google não foi configurada.");

  // Pedimos apenas as categorias que nos interessam para esta análise focada.
  const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&strategy=mobile&category=accessibility&category=best-practices&locale=pt-BR`;

  console.log(
    "A chamar a API do Google para análise de Acessibilidade e Tecnologias..."
  );
  const response = await axios.get(apiUrl);
  if (!response.data || !response.data.lighthouseResult)
    throw new Error("A API do Google devolveu uma resposta inesperada.");

  return response.data.lighthouseResult;
}

// --- NOVA FUNÇÃO DE IA, FOCADA EM ACESSIBILIDADE E TECNOLOGIAS ---
async function analyzeUiUxWithGemini(pageSpeedData, apiKey) {
  if (!apiKey) throw new Error("A chave de API do Gemini não foi configurada.");

  const { audits, categories } = pageSpeedData;

  // Extraímos os problemas de acessibilidade para dar contexto à IA
  const accessibilityIssues = Object.values(audits)
    .filter(
      (audit) =>
        audit.score !== null &&
        audit.score < 1 &&
        categories.accessibility.auditRefs.some((ref) => ref.id === audit.id)
    )
    .map((audit) => audit.title);

  // Extraímos as tecnologias detetadas
  const detectedTech =
    audits["js-libraries"]?.details?.items.map((item) => item.name) || [];

  const dataForAnalysis = {
    accessibilityScore: Math.round(categories.accessibility.score * 100),
    detectedTech: detectedTech,
    topAccessibilityIssues: accessibilityIssues.slice(0, 5), // Enviamos uma amostra
  };

  const prompt = `
    **PERSONA:** Você é o Agente Webi, um especialista em Acessibilidade (a11y) e Arquitetura Web. Sua análise é técnica, mas clara, focada em ajudar programadores e designers a criar produtos melhores.

    **TAREFA:** Analise os dados de Acessibilidade e Tecnologias de um site. Escreva uma análise aprofundada em formato de relatório.

    **DADOS BRUTOS:**
    \`\`\`json
    ${JSON.stringify(dataForAnalysis, null, 2)}
    \`\`\`

    **FORMATO OBRIGATÓRIO DO RELATÓRIO (Use Markdown e português do Brasil):**

    ### Veredito de Acessibilidade
    (Um parágrafo de resumo sobre o estado da acessibilidade do site, com base no score e nos principais problemas encontrados. Explique o impacto de uma boa acessibilidade para o negócio.)

    ### Análise Tecnológica
    (Comente sobre as tecnologias detetadas. Se for uma stack moderna como React/Next.js, elogie a escolha. Se for jQuery ou tecnologias mais antigas, mencione que, embora funcionais, podem apresentar desafios de performance e manutenção.)

    ### Recomendações Prioritárias de Acessibilidade
    (Com base nos problemas, crie uma lista numerada de 2 a 3 ações práticas que a equipa pode tomar para melhorar a acessibilidade, explicando o porquê de cada uma.)
  `;

  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  // Lógica de retry para o Gemini
  let retries = 3;
  let delay = 1000;
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(geminiApiUrl, {
        contents: [{ parts: [{ text: prompt }] }],
      });
      if (response.data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return response.data.candidates[0].content.parts[0].text;
      }
      throw new Error("Resposta vazia do Gemini.");
    } catch (error) {
      if (error.response?.status === 503 && i < retries - 1) {
        await new Promise((res) => setTimeout(res, delay));
        delay *= 2;
      } else {
        throw error;
      }
    }
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url)
      return NextResponse.json(
        { message: "A URL é obrigatória." },
        { status: 400 }
      );

    const { GOOGLE_PAGESPEED_API_KEY, GEMINI_API_KEY } = process.env;

    // 1. Buscamos os dados do PageSpeed
    const pageSpeedData = await fetchPageSpeedData(
      url,
      GOOGLE_PAGESPEED_API_KEY
    );

    // 2. Geramos a análise da IA com base nesses dados
    let geminiAnalysis =
      "### Análise de IA Indisponível\n\nO assistente não conseguiu gerar a análise de acessibilidade neste momento.";
    try {
      geminiAnalysis = await analyzeUiUxWithGemini(
        pageSpeedData,
        GEMINI_API_KEY
      );
    } catch (geminiError) {
      console.warn(
        "AVISO: A análise de UI/UX do Gemini falhou.",
        geminiError.message
      );
    }

    const { audits, categories } = pageSpeedData;

    // 3. Extraímos os dados brutos para o frontend
    const accessibilityIssues = Object.values(audits)
      .filter(
        (audit) =>
          audit.score !== null &&
          audit.score < 1 &&
          categories.accessibility.auditRefs.some((ref) => ref.id === audit.id)
      )
      .map((audit) => ({
        description: audit.title,
        count: audit.details?.items?.length || 1, // Conta os itens ou assume 1
      }));

    const technologies =
      audits["js-libraries"]?.details?.items.map((item) => ({
        name: item.name,
        version: null,
        icon: `${item.name.toLowerCase().replace(/ /g, "-")}.svg`, // Placeholder
        website: "#",
      })) || [];

    // 4. Montamos o relatório final
    const relatorioFinal = {
      url,
      accessibilityScore: Math.round(categories.accessibility.score * 100),
      geminiAnalysis,
      accessibility: {
        errors: accessibilityIssues, // Simplificado, mas funcional
        alerts: [], // A API do Google não separa erros de alertas como a do WAVE
      },
      technologies,
    };

    return NextResponse.json(relatorioFinal);
  } catch (error) {
    console.error("Erro no backend de UI/UX:", error.message);
    return NextResponse.json(
      { message: `Erro ao analisar UI/UX: ${error.message}` },
      { status: 500 }
    );
  }
}
