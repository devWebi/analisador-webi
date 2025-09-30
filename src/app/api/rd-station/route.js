import { NextResponse } from "next/server";

export async function POST(request) {
  // 1. Obter os dados do formulário
  const body = await request.json();
  const { email, name, telephone, role, url } = body;

  // 2. Obter a chave da API do ambiente de forma segura
  const apiKey = process.env.RDSTATION_API_KEY;

  // Linha de diagnóstico para vermos a chave no terminal
  console.log("CHAVE SENDO USADA:", apiKey);

  if (!apiKey) {
    console.error("Erro de configuração: RDSTATION_API_KEY não encontrada.");
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }

  // 3. Montar o payload para a API 2.0
  const payload = {
    event_type: "CONVERSION",
    event_family: "CDP",
    payload: {
      conversion_identifier: "formulario-analisador-de-site", // Identificador que criámos
      email: email,
      name: name,
      personal_phone: telephone,
      job_title: role,
      cf_url_do_site: url, // Campos personalizados devem ter o prefixo "cf_"
    },
  };

  try {
    console.log(
      "Enviando dados para a API v2 da RD Station:",
      JSON.stringify(payload, null, 2)
    );

    // 4. Fazer a chamada para o endpoint da API 2.0
    const response = await fetch("https://api.rd.services/platform/events", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`, // A chave entra aqui!
      },
      body: JSON.stringify(payload),
    });

    // 5. Analisar a resposta
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao enviar evento para a RD Station:", errorData);
      return NextResponse.json(
        { message: "Falha ao registrar evento.", details: errorData },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    console.log("Evento registrado com sucesso na RD Station:", responseData);

    return NextResponse.json(
      { message: "Evento registrado com sucesso!" },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Erro inesperado ao conectar com a API da RD Station:",
      error
    );
    return NextResponse.json(
      { message: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
