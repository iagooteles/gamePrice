import { money } from "../../format.js";
import "./PriceDeals.css";

export default function PriceDeals({ deals }) {
  if (!deals?.length) {
    return (
      <p className="price-deals__empty">Nenhuma oferta encontrada no momento.</p>
    );
  }

  return (
    <div className="price-deals">
      {deals.map((deal) => (
        <article
          className="price-deals__item"
          key={`${deal.shop?.id ?? deal.shop?.name}-${deal.url}`}
        >
          <div className="price-deals__shop">{deal.shop?.name || "Loja"}</div>
          <div className="price-deals__price">{money(deal.price)}</div>
          <div className="price-deals__regular">{money(deal.regular)}</div>
          <div className="price-deals__cut">{deal.cut ?? 0}% off</div>
          {deal.url && (
            <a
              className="price-deals__link"
              href={deal.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Abrir
            </a>
          )}
        </article>
      ))}
    </div>
  );
}
