export function money(value) {
  if (!value) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: value.currency || "BRL"
  }).format(value.amount);
}
