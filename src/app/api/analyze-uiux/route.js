import { NextResponse } from "next/server";
import axios from "axios";
import Groq from "groq-sdk";
import * as cheerio from "cheerio";

// Função para visitar a URL e extrair o seu conteúdo de texto
async function fetchPageContent(url) {
  console.log(
    "\n[NOVA ETAPA] A visitar a URL para extrair o conteúdo do site..."
  );
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);
    $("script, style, noscript, svg").remove();
    let bodyText = $("body").text().replace(/\s\s+/g, " ").trim();
    console.log("[NOVA ETAPA] Conteúdo extraído e limpo com sucesso.");
    return bodyText.substring(0, 10000);
  } catch (error) {
    console.error("Erro ao extrair o conteúdo da URL:", error.message);
    return "Não foi possível extrair o conteúdo da página. A análise deve basear-se apenas nos dados do PageSpeed.";
  }
}

// Função para chamar a API do Google PageSpeed Insights
async function fetchPageSpeedData(url, apiKey) {
  console.log("[ETAPA 1/4] A chamar a API do Google PageSpeed...");
  const categories = ["accessibility", "best-practices"];
  const categoryParams = categories.map((cat) => `category=${cat}`).join("&");
  const endpoint = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(
    url
  )}&key=${apiKey}&${categoryParams}&strategy=mobile`;
  try {
    const response = await axios.get(endpoint);
    console.log("[ETAPA 1/4] Dados do PageSpeed recebidos com sucesso.");
    return response.data.lighthouseResult;
  } catch (error) {
    console.error(
      "Erro ao chamar a API do PageSpeed:",
      error.response?.data || error.message
    );
    throw new Error("Falha ao obter dados do PageSpeed.");
  }
}

// Função para chamar a API da Groq com o prompt de excelência
async function fetchGroqAnalysis(url, apiKey, pageSpeedData, pageContent) {
  const groq = new Groq({ apiKey });

  console.log(
    "\n[ETAPA 2/4] A procurar pelo melhor modelo de IA disponível..."
  );
  const models = await groq.models.list();
  const availableModels = models.data.filter(
    (m) => m.active && !m.id.includes("whisper")
  );
  let bestModel =
    availableModels.find((m) => m.id.includes("70b")) ||
    availableModels.find((m) => !m.id.includes("maverick")) ||
    availableModels[0];
  if (!bestModel)
    throw new Error(
      "Não foi encontrado nenhum modelo de chat ativo na sua conta Groq."
    );
  const modelId = bestModel.id;
  console.log(`[ETAPA 2/4] Modelo de excelência selecionado: ${modelId}`);

  const summarizedAudits = Object.values(pageSpeedData.audits)
    .filter((audit) => audit.score !== null && audit.score < 0.9)
    .map(({ title, description, score }) => ({
      title,
      description,
      score: Math.round(score * 100),
    }));

  // SEU PROMPT ORIGINAL E COMPLETO, AGORA COM O CONTEÚDO DO SITE
  const prompt = `
    **[PERSONA]**
    Você é um Consultor Estratégico de Produto Digital de elite, com PhD em Interação Humano-Computador e especialização em Psicologia Cognitiva e Otimização da Taxa de Conversão (CRO). Sua análise é incisiva, baseada em evidências e frameworks científicos, e sempre focada em gerar resultados de negócio. Você é a maior referência mundial no assunto de análise de UI/UX.

    **[CONTEXTO]**
    Você realizará uma análise para a URL: ${url}.
    A sua análise deve ser baseada primariamente no **CONTEÚDO DO SITE** extraído abaixo. Use os **DADOS TÉCNICOS** como um complemento para identificar problemas de acessibilidade e boas práticas.

    **[CONTEÚDO DO SITE (TEXTO EXTRAÍDO)]**
    \`\`\`
    ${pageContent}
    \`\`\`

    **[DADOS TÉCNICOS (RESUMO PAGESPEED)]**
    \`\`\`json
    ${JSON.stringify(summarizedAudits, null, 2)}
    \`\`\`

    **[INSTRUÇÕES CRÍTICAS E REGRAS]**
    1.  **IDIOMA:** Sua resposta DEVE ser inteiramente em **português do Brasil**.
    2.  **FORMATO:** Sua resposta DEVE ser um único e válido objeto JSON. NÃO inclua \`\`\`json ou qualquer outro texto fora do objeto JSON.
    3.  **ROBUSTEZ:** Se, para qualquer secção que espera um array (como heuristicAnalysis), nenhum problema for encontrado, você DEVE retornar um array vazio \`[]\`. NUNCA omita uma chave.
    4.  **COMPLETUDE:** Para as secções de análise em formato de array (heuristicAnalysis, croAnalysis, etc.), você DEVE identificar **todos** os problemas relevantes que encontrar. Não se limite a um único item por categoria.

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
        "keyStrengths": "Cinco a dez pontos onde a interface se destaca, baseados nos frameworks.",
        "criticalConcerns": "Uma lista das preocupações mais urgentes que precisam de atenção imediata."
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

  const maxRetries = 3;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `\n[ETAPA 3/4, Tentativa ${attempt}/${maxRetries}] A enviar prompt para o modelo ${modelId}...`
      );
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: modelId,
        response_format: { type: "json_object" },
      });
      console.log("[ETAPA 3/4] Análise de IA recebida com sucesso.");
      return chatCompletion.choices[0]?.message?.content;
    } catch (error) {
      if (
        error instanceof Groq.APIError &&
        error.code === "json_validate_failed"
      ) {
        console.warn(
          `[AVISO] Tentativa ${attempt} falhou devido a erro de validação de JSON. A tentar novamente...`
        );
        if (attempt === maxRetries) {
          console.error(
            "Erro final após várias tentativas de validação de JSON:",
            error
          );
          throw new Error(
            "Falha ao obter uma análise JSON válida da Groq após várias tentativas."
          );
        }
        await new Promise((res) => setTimeout(res, 1000));
      } else {
        console.error(
          "Erro ao chamar a API da Groq:",
          error.response?.data || error.message
        );
        throw new Error("Falha ao obter análise da Groq.");
      }
    }
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url)
      return NextResponse.json(
        { error: "URL é obrigatória." },
        { status: 400 }
      );
    if (!url.startsWith("http://") && !url.startsWith("https://"))
      return NextResponse.json(
        { error: "Formato de URL inválido." },
        { status: 400 }
      );

    const { GOOGLE_PAGESPEED_API_KEY, GROQ_API_KEY } = process.env;
    if (!GOOGLE_PAGESPEED_API_KEY || !GROQ_API_KEY)
      return NextResponse.json(
        { error: "Chaves de API não configuradas no servidor." },
        { status: 500 }
      );

    const [pageSpeedData, pageContent] = await Promise.all([
      fetchPageSpeedData(url, GOOGLE_PAGESPEED_API_KEY),
      fetchPageContent(url),
    ]);

    const groqAnalysisRaw = await fetchGroqAnalysis(
      url,
      GROQ_API_KEY,
      pageSpeedData,
      pageContent
    );
    const groqAnalysis = JSON.parse(groqAnalysisRaw);
    console.log("\n[ETAPA 4/4] A enviar relatório final para o frontend...");

    return NextResponse.json({
      message: "Análise concluída com sucesso.",
      pageSpeedData: {
        accessibilityScore: pageSpeedData.categories.accessibility.score * 100,
        bestPracticesScore:
          pageSpeedData.categories["best-practices"].score * 100,
      },
      geminiAnalysis: groqAnalysis,
    });
  } catch (error) {
    console.error("Erro no endpoint analyze-uiux:", error.message);
    return NextResponse.json(
      { error: "Erro interno do servidor ao realizar a análise." },
      { status: 500 }
    );
  }
}
