import { NextResponse } from "next/server";
import axios from "axios";

// Função para chamar a API do Google PageSpeed Insights
async function fetchPageSpeedData(url, apiKey) {
  const categories = ["accessibility", "best-practices"];
  const categoryParams = categories.map((cat) => `category=${cat}`).join("&");
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&${categoryParams}&strategy=mobile`;

  try {
    const response = await axios.get(endpoint);
    return response.data.lighthouseResult;
  } catch (error) {
    console.error(
      "Erro ao chamar a API do PageSpeed:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao obter dados do PageSpeed.");
  }
}

// Função para chamar a API do Google Gemini com o prompt mais avançado
async function fetchGeminiAnalysis(url, apiKey, pageSpeedData) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

  const audits = Object.values(pageSpeedData.audits).filter(
    (audit) => audit.score !== null
  );

  const prompt = `
    **[PERSONA]**
    Você é um Consultor Estratégico de Produto Digital de elite, com PhD em Interação Humano-Computador e especialização em Psicologia Cognitiva e Otimização da Taxa de Conversão (CRO). Sua análise é incisiva, baseada em evidências e frameworks científicos, e sempre focada em gerar resultados de negócio. Você é a maior referência mundial no assunto de análise de UI/UX.

    **[CONTEXTO]**
    Você realizará uma análise para a URL: ${url}
    Você tem como referência os seguintes dados técnicos do PageSpeed, mas sua análise deve ir muito além deles:
    \`\`\`json
    ${JSON.stringify(audits, null, 2)}
    \`\`\`

    **[INSTRUÇÕES CRÍTICAS E REGRAS]**
    1.  **IDIOMA:** Sua resposta DEVE ser inteiramente em **português do Brasil**.
    2.  **FORMATO:** Sua resposta DEVE ser um único e válido objeto JSON. NÃO inclua \`\`\`json ou qualquer outro texto fora do objeto JSON.
    3.  **ROBUSTEZ:** Se, para qualquer secção que espera um array (como heuristicAnalysis), nenhum problema for encontrado, você DEVE retornar um array vazio \`[]\`. NUNCA omita uma chave.

    **[METODOLOGIA CIENTÍFICA DE ANÁLISE]**
    Sua análise é uma auditoria completa e deve ser estruturada sobre os seguintes frameworks:

    1.  **Framework Primário - Heurísticas de Nielsen (OBRIGATÓRIO):**
        Você DEVE avaliar a interface em relação a cada uma das 10 Heurísticas de Usabilidade de Jakob Nielsen. Para cada uma, procure por evidências concretas.

    2.  **Filtros Cognitivos Secundários (OBRIGATÓRIO):**
        Além das heurísticas, você DEVE aplicar os seguintes 'filtros' cognitivos na sua avaliação:
        * **Princípios da Gestalt:** Avalie a organização, agrupamento e relação entre os elementos (proximidade, similaridade, fechamento).
        * **Lei de Fitts:** Avalie a ergonomia dos alvos de interação (botões, links). Eles são grandes e fáceis de alcançar, especialmente no mobile?
        * **Lei de Hick:** Avalie a carga cognitiva. O número de escolhas apresentadas ao utilizador é excessivo, levando à paralisia da decisão?

    **[ESCOPO DA ANÁLISE]**
    Você deve cobrir as seguintes áreas:

    1.  **Análise Heurística:** Identifique violações diretas das 10 heurísticas.
    2.  **Análise de Conversão (CRO):** Identifique o objetivo da página e avalie a eficácia do funil para levar o utilizador a essa conversão. Foque-se na clareza e persuasão dos CTAs.
    3.  **Análise de Escrita de UX (UX Writing):** Avalie a clareza, concisão e tom de voz da microcopy (textos de botões, labels, mensagens de erro, etc.).
    4.  **Análise de Design Inclusivo:** Identifique oportunidades de melhoria de acessibilidade que vão além dos testes automatizados do PageSpeed.

    **[SCHEMA DE SAÍDA JSON - ESTRUTURA OBRIGATÓRIA]**
    Sua resposta DEVE seguir esta estrutura JSON detalhada:

    \`\`\`json
    {
      "executiveSummary": {
        "pageGoal": "O objetivo de negócio principal que você inferiu da página.",
        "overallScore": "Uma nota de 0 a 10, com uma casa decimal, representando a qualidade geral da experiência do utilizador, com uma justificação técnica.",
        "keyStrengths": "Dois ou três pontos onde a interface se destaca, baseados nos frameworks.",
        "criticalConcerns": "As duas ou três preocupações mais urgentes que precisam de atenção imediata."
      },
      "quickWins": [
        {
          "title": "Um título curto e acionável para a melhoria.",
          "description": "Uma descrição clara de como implementar esta melhoria de baixo esforço e alto impacto.",
          "impact": "Alto"
        }
      ],
      "heuristicAnalysis": [
        {
          "heuristicNumber": 1,
          "heuristicName": "Visibilidade do estado do sistema",
          "observation": "Descrição detalhada e técnica do problema específico encontrado.",
          "evidence": "Descrição do elemento específico da UI que demonstra o problema (ex: 'O botão de login não mostra um spinner após o clique').",
          "recommendation": "Uma sugestão tática e acionável para resolver o problema.",
          "severity": "Crítico"
        }
      ],
      "croAnalysis": [
        {
          "element": "Elemento a ser otimizado (ex: 'CTA Principal da Hero Section')",
          "issue": "O problema específico relacionado à conversão, explicado com base em princípios de persuasão.",
          "suggestion": "Sugestão de otimização (ex: 'Alterar o texto para 'Iniciar Teste Gratuito' para reduzir a fricção e aumentar a clareza da oferta').",
          "severity": "Alto"
        }
      ],
      "uxWritingAnalysis": [
          {
              "elementText": "O texto exato do elemento analisado (ex: 'Submeter').",
              "issue": "O problema com o texto (ex: 'Vago, genérico, não focado no benefício do utilizador').",
              "suggestion": "Uma reescrita sugerida com uma justificação (ex: 'Alterar para 'Criar Minha Conta' para ser mais específico e pessoal').",
              "severity": "Médio"
          }
      ]
    }
    \`\`\`
  `;

  try {
    const response = await axios.post(
      endpoint,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error(
      "Erro ao chamar a API do Gemini:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao obter análise do Gemini.");
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL é obrigatória." },
        { status: 400 }
      );
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Formato de URL inválido." },
        { status: 400 }
      );
    }

    const PAGESPEED_API_KEY = process.env.GOOGLE_PAGESPEED_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PAGESPEED_API_KEY || !GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Chaves de API não configuradas no servidor." },
        { status: 500 }
      );
    }

    const pageSpeedData = await fetchPageSpeedData(url, PAGESPEED_API_KEY);
    const geminiAnalysisRaw = await fetchGeminiAnalysis(
      url,
      GEMINI_API_KEY,
      pageSpeedData
    );

    const geminiAnalysis = JSON.parse(geminiAnalysisRaw);

    return NextResponse.json({
      message: "Análise concluída com sucesso.",
      pageSpeedData: {
        accessibilityScore: pageSpeedData.categories.accessibility.score * 100,
        bestPracticesScore:
          pageSpeedData.categories["best-practices"].score * 100,
      },
      geminiAnalysis,
    });
  } catch (error) {
    console.error("Erro no endpoint analyze-uiux:", error.message);
    return NextResponse.json(
      { error: "Erro interno do servidor ao realizar a análise." },
      { status: 500 }
    );
  }
}
