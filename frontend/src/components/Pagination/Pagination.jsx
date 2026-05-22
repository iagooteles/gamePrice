import "./Pagination.css";

function pageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("…");
    }
    result.push(sorted[i]);
  }

  return result;
}

export default function Pagination({
  page,
  totalPages,
  hasPrev,
  hasNext,
  onPageChange,
}) {
  const items = pageNumbers(page, totalPages);

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="pagination__btn"
        disabled={!hasPrev}
        onClick={() => onPageChange(page - 1)}
        aria-label="Página anterior"
      >
        Anterior
      </button>

      <ul className="pagination__list">
        {items.map((item, index) =>
          item === "…" ? (
            <li key={`ellipsis-${index}`} className="pagination__ellipsis" aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={`pagination__page ${
                  item === page ? "pagination__page--active" : ""
                }`}
                onClick={() => onPageChange(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ul>

      <button
        type="button"
        className="pagination__btn"
        disabled={!hasNext}
        onClick={() => onPageChange(page + 1)}
        aria-label="Próxima página"
      >
        Próxima
      </button>
    </nav>
  );
}
