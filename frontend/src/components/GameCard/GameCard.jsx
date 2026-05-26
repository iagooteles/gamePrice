import "./GameCard.css";

function formatRating(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Number(value).toFixed(1);
}

export default function GameCard({ game, onClick }) {
  const rating = formatRating(game.totalRating ?? game.rating);

  return (
    <article
      className="game-card"
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(game)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.(game);
        }
      }}
      aria-label={`Ver detalhes de ${game.title}`}
    >
      <div className="game-card__cover-wrap">
        {game.coverImageUrl ? (
          <img
            className="game-card__cover"
            src={game.coverImageUrl}
            alt={`Capa de ${game.title}`}
            loading="lazy"
          />
        ) : (
          <div className="game-card__cover game-card__cover--placeholder" aria-hidden>
            ?
          </div>
        )}
        {game.rank != null && (
          <span className="game-card__rank">#{game.rank}</span>
        )}
      </div>

      <div className="game-card__body">
        <h2 className="game-card__title">{game.title}</h2>

        {game.genres && <p className="game-card__genres">{game.genres}</p>}

        <dl className="game-card__meta">
          {game.developer && (
            <>
              <dt>Dev</dt>
              <dd>{game.developer}</dd>
            </>
          )}
          {game.releaseDate && (
            <>
              <dt>Lanç.</dt>
              <dd>{game.releaseDate}</dd>
            </>
          )}
          {rating && (
            <>
              <dt>Nota</dt>
              <dd>{rating}</dd>
            </>
          )}
        </dl>

        {game.description && (
          <p className="game-card__description">{game.description}</p>
        )}

        {game.igdbUrl && (
          <a
            className="game-card__link"
            href={game.igdbUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            Ver na IGDB
          </a>
        )}
      </div>
    </article>
  );
}
