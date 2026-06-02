import "./GameCard.css";

function formatRating(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Number(value).toFixed(1);
}

function getRatingTone(value) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "neutral";
  if (numeric >= 80) return "high";
  if (numeric >= 65) return "mid";
  return "low";
}

function parseGenres(genres) {
  if (!genres) return [];
  if (Array.isArray(genres)) return genres.filter(Boolean).slice(0, 3);
  return String(genres)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 3);
}

export default function GameCard({ game, onClick }) {
  const rating = formatRating(game.totalRating ?? game.rating);
  const ratingTone = getRatingTone(game.totalRating ?? game.rating);
  const genres = parseGenres(game.genres);

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

        {genres.length > 0 && (
          <div className="game-card__genres" aria-label="Gêneros do jogo">
            {genres.map((genre) => (
              <span key={genre} className="game-card__genre-pill">
                {genre}
              </span>
            ))}
          </div>
        )}

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
              <dd className={`game-card__rating game-card__rating--${ratingTone}`}>
                {rating}
              </dd>
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
