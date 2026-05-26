import "./GameDetail.css";

function formatRating(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Number(value).toFixed(1);
}

function formatPopularity(value) {
  if (value == null || Number.isNaN(Number(value))) return null;
  return Number(value).toFixed(6);
}

function DetailItem({ label, children }) {
  if (children == null || children === "") return null;

  return (
    <div className="game-detail__info-item">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function GameDetail({ game, onBack }) {
  const rating = formatRating(game.totalRating ?? game.rating);
  const popularity = formatPopularity(game.igdbPopularityValue);

  return (
    <section className="game-detail" aria-labelledby="game-detail-title">
      <button type="button" className="game-detail__back" onClick={onBack}>
        Voltar para o catálogo
      </button>

      <div className="game-detail__hero">
        <div className="game-detail__cover-wrap">
          {game.coverImageUrl ? (
            <img
              className="game-detail__cover"
              src={game.coverImageUrl}
              alt={`Capa de ${game.title}`}
            />
          ) : (
            <div className="game-detail__cover game-detail__cover--placeholder">
              Sem capa
            </div>
          )}
          {game.rank != null && (
            <span className="game-detail__rank">#{game.rank}</span>
          )}
        </div>

        <div className="game-detail__content">
          <p className="game-detail__eyebrow">Detalhes do jogo</p>
          <h1 id="game-detail-title" className="game-detail__title">
            {game.title}
          </h1>

          {game.genres && <p className="game-detail__genres">{game.genres}</p>}

          <dl className="game-detail__info">
            <DetailItem label="Desenvolvedora">{game.developer}</DetailItem>
            <DetailItem label="Publicadora">{game.publisher}</DetailItem>
            <DetailItem label="Lançamento">{game.releaseDate}</DetailItem>
            <DetailItem label="Nota">{rating}</DetailItem>
            <DetailItem label="Avaliações">
              {game.totalRatingCount ?? game.ratingCount}
            </DetailItem>
            <DetailItem label="Popularidade IGDB">{popularity}</DetailItem>
            <DetailItem label="IGDB ID">{game.igdbId}</DetailItem>
            <DetailItem label="Slug">{game.slug}</DetailItem>
          </dl>

          {game.igdbUrl && (
            <a
              className="game-detail__external"
              href={game.igdbUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ver página na IGDB
            </a>
          )}
        </div>
      </div>

      <article className="game-detail__description-card">
        <h2>Descrição</h2>
        <p>{game.description || "Este jogo ainda não possui descrição."}</p>
      </article>
    </section>
  );
}
