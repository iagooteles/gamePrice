export function money(value) {
  if (!value || value.amount == null) return "-";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: value.currency || "BRL",
  }).format(value.amount);
}

export function formatDateTime(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
