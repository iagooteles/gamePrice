const { getRequiredEnv } = require("./src/config/env.js");

const API_KEY = getRequiredEnv("ITAD_API_KEY");

async function buscarJogo(nome) {
  const response = await fetch(
    `https://api.isthereanydeal.com/games/search/v1?title=${encodeURIComponent(nome)}`,
    {
      headers: {
        "ITAD-API-Key": API_KEY
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao buscar jogo: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function buscarPrecos(gameId) {
  const response = await fetch(
    "https://api.isthereanydeal.com/games/prices/v3?country=BR&capacity=5",
    {
      method: "POST",
      headers: {
        "ITAD-API-Key": API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify([gameId])
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Erro ao buscar precos: ${response.status} ${JSON.stringify(data)}`);
  }

  return data;
}

async function main() {
  const resultados = await buscarJogo("Red Dead Redemption 2");
  const jogo = resultados.find((item) => item.type === "game") || resultados[0];

  if (!jogo) {
    console.log("Nenhum jogo encontrado.");
    return;
  }

  const precos = await buscarPrecos(jogo.id);
  const dadosDoJogo = precos[0];

  console.log(`Jogo: ${jogo.title}`);
  console.log(`Menor preco historico: R$ ${dadosDoJogo.historyLow.all.amount}`);
  console.log("Ofertas atuais:");

  for (const oferta of dadosDoJogo.deals) {
    console.log(
      `- ${oferta.shop.name}: R$ ${oferta.price.amount} (${oferta.cut}% off) - ${oferta.url}`
    );
  }
}

main().catch((error) => {
  console.error(error.message);
});
