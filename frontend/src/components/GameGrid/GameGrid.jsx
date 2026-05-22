import GameCard from "../GameCard/GameCard.jsx";
import "./GameGrid.css";

export default function GameGrid({ games }) {
  if (!games.length) {
    return <p className="game-grid__empty">Nenhum jogo encontrado.</p>;
  }

  return (
    <section className="game-grid" aria-label="Lista de jogos">
      {games.map((game) => (
        <GameCard key={game.id ?? game.igdbId} game={game} />
      ))}
    </section>
  );
}
