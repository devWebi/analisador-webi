import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Obter a configuração do Firebase a partir das variáveis de ambiente
const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
);

// Inicializar o Firebase (garantindo que não é inicializado mais do que uma vez)
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export async function POST(request) {
  // Verificar se a configuração do Firebase foi carregada
  if (!firebaseConfig.apiKey) {
    console.error(
      "FIREBASE ERROR: Configuração do Firebase não encontrada nas variáveis de ambiente."
    );
    return NextResponse.json(
      { message: "Erro de configuração no servidor." },
      { status: 500 }
    );
  }

  try {
    // 1. Obter os dados do formulário a partir do pedido
    const formData = await request.json();
    console.log("[API/SAVE-LEAD] Dados recebidos:", formData);

    // Validação simples para garantir que os dados essenciais estão presentes
    if (!formData.email || !formData.name) {
      return NextResponse.json(
        { message: "Dados incompletos. Email e Nome são obrigatórios." },
        { status: 400 }
      );
    }

    // 2. Guardar os dados na coleção "leads" no Firestore
    const docRef = await addDoc(collection(db, "leads"), {
      ...formData,
      createdAt: new Date().toISOString(), // Adicionar um carimbo de data/hora
    });

    console.log(
      "✅ [API/SAVE-LEAD] Lead guardado com sucesso no Firestore com o ID:",
      docRef.id
    );

    // 3. Enviar uma resposta de sucesso de volta para o formulário
    return NextResponse.json(
      { message: "Lead guardado com sucesso!", id: docRef.id },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "❌ [API/SAVE-LEAD] Erro ao guardar o lead no Firestore:",
      error
    );
    return NextResponse.json(
      { message: "Erro ao guardar na base de dados.", error: error.message },
      { status: 500 }
    );
  }
}
