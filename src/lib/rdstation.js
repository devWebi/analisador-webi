// Esta função usa as suas credenciais para obter um token de acesso temporário.
async function getAccessToken() {
  const {
    RDSTATION_CLIENT_ID,
    RDSTATION_CLIENT_SECRET,
    RDSTATION_REFRESH_TOKEN,
  } = process.env;

  if (
    !RDSTATION_CLIENT_ID ||
    !RDSTATION_CLIENT_SECRET ||
    !RDSTATION_REFRESH_TOKEN
  ) {
    throw new Error("Credenciais da RD Station não configuradas no ambiente.");
  }

  try {
    const response = await fetch("https://api.rd.services/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: RDSTATION_CLIENT_ID,
        client_secret: RDSTATION_CLIENT_SECRET,
        refresh_token: RDSTATION_REFRESH_TOKEN,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro ao obter access token da RD Station:", errorData);
      throw new Error("Falha ao autenticar com a RD Station.");
    }

    const data = await response.json();
    return data.access_token; // Retornamos apenas o token de acesso
  } catch (error) {
    console.error("Erro de rede ao tentar obter access token:", error);
    throw error;
  }
}

// Exportamos a função para que a nossa rota de API possa usá-la.
export { getAccessToken };
