import { apiUrl } from "./config.js";

export async function fetchGamePrices(gameId) {
  const res = await fetch(apiUrl(`/api/games/${encodeURIComponent(gameId)}/prices`));
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.error || data.message || "Falha ao carregar preços do jogo."
    );
  }

  return data;
}
