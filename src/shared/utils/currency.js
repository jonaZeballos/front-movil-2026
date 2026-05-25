export function formatCurrency(value, currency = "Bs") {
  const number = Number(value || 0);

  return `${currency} ${number.toFixed(2)}`;
}

export function parseCurrency(value) {
  const normalized = String(value || "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  const number = Number(normalized);

  return Number.isFinite(number) ? number : 0;
}