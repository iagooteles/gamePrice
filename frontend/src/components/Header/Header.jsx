import "./Header.css";

export default function Header({ total, perPage, currentPage, totalPages }) {
  return (
    <header className="header">
      <p className="header__eyebrow">GamePrice Explorer</p>
      <h1 className="header__title">Descubra os melhores jogos</h1>
      <p className="header__subtitle">Uma seleção popular da IGDB com navegação rápida e visual moderno</p>
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
