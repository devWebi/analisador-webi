// Importar a biblioteca oficial da Groq
import Groq from "groq-sdk";
// Importamos o 'dotenv' para carregar as variáveis de ambiente
import dotenv from "dotenv";
import path from "path";

// Forçamos o dotenv a ler o ficheiro .env.local a partir do diretório atual
const envPath = path.resolve(process.cwd(), ".env.local");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error(
    "ERRO CRÍTICO: O dotenv não conseguiu carregar o ficheiro .env.local.",
    result.error
  );
} else {
  console.log("Ficheiro .env.local carregado com sucesso.");
}

// Função de teste assíncrona
async function runTest() {
  try {
    // 1. Carregar a sua chave de API da Groq
    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    if (!GROQ_API_KEY) {
      console.error(
        "ERRO: Chave de API da Groq não encontrada em process.env. Verifique se a variável GROQ_API_KEY existe no seu ficheiro .env.local."
      );
      return;
    }

    console.log("\nTeste de 'Sala Limpa' para a Groq iniciado...");
    console.log(
      "A usar a chave de API que termina em: ...",
      GROQ_API_KEY.slice(-4)
    );

    // 2. Inicializar o cliente da API da Groq
    const groq = new Groq({
      apiKey: GROQ_API_KEY,
    });

    // --- NOVO PASSO: Encontrar um modelo disponível dinamicamente ---
    console.log("\nA procurar por um modelo de chat disponível...");
    const models = await groq.models.list();
    // Filtramos para encontrar um modelo ativo que não seja para transcrição (whisper)
    const availableModel = models.data.find(
      (m) => m.active && !m.id.includes("whisper")
    );

    if (!availableModel) {
      throw new Error(
        "Não foi encontrado nenhum modelo de chat ativo na sua conta Groq."
      );
    }
    const modelId = availableModel.id;
    console.log(
      `Modelo encontrado: ${modelId}. A usar este modelo para o teste.`
    );
    // -----------------------------------------------------------------

    // 3. Fazer uma chamada simples
    console.log(`A enviar pedido para o modelo ${modelId}...`);
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: "Olá, mundo! Responde com 'OK'." }],
      // Usamos o ID do modelo encontrado dinamicamente
      model: modelId,
    });

    // 4. Mostrar o resultado
    const text = chatCompletion.choices[0]?.message?.content;
    console.log("\n--- RESULTADO ---");
    console.log("Resposta da API:", text);
    console.log(
      "\n✅ SUCESSO! A sua chave de API da Groq está a funcionar corretamente."
    );
  } catch (error) {
    console.error("\n--- FALHA ---");
    console.error("❌ O teste da Groq falhou.");
    console.error("Erro detalhado:", error);
  }
}

// Executar o teste
runTest();
