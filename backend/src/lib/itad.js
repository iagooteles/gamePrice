function getItadApiKey() {
  const key = process.env.ITAD_API_KEY?.trim();
  if (!key) {
    throw new Error("ITAD_API_KEY não configurada no backend/.env.");
  }
  return key;
}

export function isItadConfigured() {
  return Boolean(process.env.ITAD_API_KEY?.trim());
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, options);
  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.reason_phrase ||
      data?.error ||
      `Erro HTTP ${response.status} ao chamar ITAD.`;
    throw new Error(message);
  }

  return data;
}

export async function searchGames(title) {
  const apiKey = getItadApiKey();
  return requestJson(
    `https://api.isthereanydeal.com/games/search/v1?title=${encodeURIComponent(title)}`,
    {
      headers: {
        "ITAD-API-Key": apiKey,
      },
    }
  );
}

export async function findGameByTitle(title) {
  const games = await searchGames(title);
  if (!Array.isArray(games) || games.length === 0) return null;
  return games.find((item) => item.type === "game") || games[0];
}

export async function getPrices(gameId) {
  const apiKey = getItadApiKey();
  return requestJson(
    "https://api.isthereanydeal.com/games/prices/v3?country=BR&capacity=8",
    {
      method: "POST",
      headers: {
        "ITAD-API-Key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([gameId]),
    }
  );
}

export async function getPriceHistory(gameId, since) {
  const apiKey = getItadApiKey();
  const params = new URLSearchParams({
    id: gameId,
    country: "BR",
  });

  if (since) {
    params.set("since", since);
  }

  return requestJson(
    `https://api.isthereanydeal.com/games/history/v2?${params}`,
    {
      headers: {
        "ITAD-API-Key": apiKey,
      },
    }
  );
}
