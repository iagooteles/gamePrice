const GAMES_PER_PAGE = 20;

export async function fetchGames(page = 1) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(GAMES_PER_PAGE),
  });

  const res = await fetch(`/api/games?${params}`);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Falha ao carregar jogos.");
  }

  return data;
}

export { GAMES_PER_PAGE };
