export async function searchGame(title) {
  const response = await fetch(`/api/search?title=${encodeURIComponent(title)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar jogo.");
  }

  return data;
}

export async function fetchPriceHistory(gameId) {
  const response = await fetch(`/api/history?id=${encodeURIComponent(gameId)}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Erro ao buscar historico de precos.");
  }

  return data;
}
