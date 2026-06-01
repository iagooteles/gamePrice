const http = require("node:http");
const { URL } = require("node:url");
const { getRequiredEnv } = require("./config/env.js");

const PORT = process.env.PORT || 3001;
const API_KEY = getRequiredEnv("ITAD_API_KEY");

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  response.end(JSON.stringify(payload));
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.reason_phrase || `Erro HTTP ${response.status}`);
  }

  return data;
}

async function searchGames(title) {
  return requestJson(
    `https://api.isthereanydeal.com/games/search/v1?title=${encodeURIComponent(title)}`,
    {
      headers: {
        "ITAD-API-Key": API_KEY
      }
    }
  );
}

async function findGameByTitle(title) {
  const games = await searchGames(title);
  return games.find((item) => item.type === "game") || games[0] || null;
}

async function getPrices(gameId) {
  return requestJson("https://api.isthereanydeal.com/games/prices/v3?country=BR&capacity=8", {
    method: "POST",
    headers: {
      "ITAD-API-Key": API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify([gameId])
  });
}

async function getPriceHistory(gameId, since) {
  const params = new URLSearchParams({
    id: gameId,
    country: "BR"
  });

  if (since) {
    params.set("since", since);
  }

  return requestJson(`https://api.isthereanydeal.com/games/history/v2?${params}`, {
    headers: {
      "ITAD-API-Key": API_KEY
    }
  });
}

async function handleSearch(requestUrl, response) {
  const title = requestUrl.searchParams.get("title");

  if (!title || !title.trim()) {
    sendJson(response, 400, { error: "Informe o nome do jogo." });
    return;
  }

  const game = await findGameByTitle(title.trim());

  if (!game) {
    sendJson(response, 404, { error: "Nenhum jogo encontrado." });
    return;
  }

  const prices = await getPrices(game.id);
  const priceData = prices[0] || { deals: [] };

  sendJson(response, 200, {
    game,
    historyLow: priceData.historyLow || null,
    deals: priceData.deals || []
  });
}

async function handleHistory(requestUrl, response) {
  const title = requestUrl.searchParams.get("title");
  const id = requestUrl.searchParams.get("id");
  const since = requestUrl.searchParams.get("since");

  if ((!title || !title.trim()) && (!id || !id.trim())) {
    sendJson(response, 400, { error: "Informe title ou id do jogo." });
    return;
  }

  const game = title ? await findGameByTitle(title.trim()) : null;
  const gameId = id?.trim() || game?.id;

  if (!gameId) {
    sendJson(response, 404, { error: "Nenhum jogo encontrado." });
    return;
  }

  const history = await getPriceHistory(gameId, since);

  sendJson(response, 200, {
    game,
    id: gameId,
    count: history.length,
    history
  });
}

const server = http.createServer(async (request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);

  try {
    if (requestUrl.pathname === "/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (requestUrl.pathname === "/api/search") {
      await handleSearch(requestUrl, response);
      return;
    }

    if (requestUrl.pathname === "/api/history") {
      await handleHistory(requestUrl, response);
      return;
    }

    sendJson(response, 404, { error: "Rota nao encontrada." });
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  console.log(`Busca: http://localhost:${PORT}/api/search?title=Red%20Dead%20Redemption%202`);
  console.log(`Historico: http://localhost:${PORT}/api/history?title=Red%20Dead%20Redemption%202`);
});
