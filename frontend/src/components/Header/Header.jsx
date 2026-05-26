import "./Header.css";

export default function Header({ total, perPage, currentPage, totalPages }) {
  return (
    <header className="header">
      <h1 className="header__title">Catálogo de jogos</h1>
      <p className="header__subtitle">Os jogos mais populares na IGDB</p>
      {total != null && (
        <p className="header__meta">
          {total} jogos · {perPage} por página
          {totalPages > 0 && currentPage != null && (
            <>
              {" "}
              · página {currentPage} de {totalPages}
            </>
          )}
        </p>
      )}
    </header>
  );
}
