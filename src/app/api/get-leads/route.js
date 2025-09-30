import { NextResponse } from "next/server";
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// Carrega a configuração do Firebase
const firebaseConfig = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "{}"
);

// Inicializa o Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);

export async function GET(request) {
  // Extrai os parâmetros de busca da URL (ex: /api/get-leads?role=Estudante&sortBy=createdAt)
  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const sortBy = searchParams.get("sortBy") || "createdAt"; // Ordenação padrão por data
  const sortOrder = searchParams.get("sortOrder") || "desc"; // Ordem padrão descendente

  console.log(
    `▶️ A executar consulta: Filtrar por role='${
      role || "todos"
    }', ordenar por '${sortBy}' em ordem '${sortOrder}'`
  );

  try {
    const leadsCollection = collection(db, "leads");

    // Constrói a consulta dinamicamente
    const queryConstraints = [];

    // Adiciona o filtro de 'role', se ele for fornecido na URL
    if (role) {
      queryConstraints.push(where("role", "==", role));
    }

    // Adiciona a ordenação
    // O Firestore exige que o primeiro orderBy seja no mesmo campo de uma cláusula 'where' de desigualdade (não é o nosso caso)
    // Se estivermos a filtrar por 'role', podemos precisar de um índice composto para ordenar por outro campo.
    queryConstraints.push(orderBy(sortBy, sortOrder));

    // Monta a consulta final
    const q = query(leadsCollection, ...queryConstraints);

    const querySnapshot = await getDocs(q);

    const leads = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`✅ Consulta bem-sucedida! Encontrados ${leads.length} leads.`);
    return NextResponse.json({ leads }, { status: 200 });
  } catch (error) {
    // Apanha o erro se a consulta exigir um novo índice composto
    console.error(
      "❌ ERRO DO FIREBASE (PROVAVELMENTE UM ÍNDICE EM FALTA - ISTO É BOM!):"
    );
    console.error(
      "Se a mensagem de erro incluir um link, copie-o e cole-o no seu navegador para criar o índice necessário."
    );
    console.error(error.message);

    return NextResponse.json(
      {
        message:
          "A consulta falhou. Verifique o seu terminal para encontrar um possível link de criação de índice.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
