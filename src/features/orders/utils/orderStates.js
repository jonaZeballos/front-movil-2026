export const ORDER_STATES = [
  {
    value: "recibido",
    label: "1. Recibido",
    shortLabel: "Recibido",
    step: 1,
    color: { bg: "#E5E7EB", text: "#374151" },
    aliases: ["Recibido"],
  },
  {
    value: "en_diagnostico",
    label: "2. En diagnostico",
    shortLabel: "En diagnostico",
    step: 2,
    color: { bg: "#EDEBFF", text: "#5655B9" },
    aliases: ["En diagnostico", "En diagnóstico"],
  },
  {
    value: "cotizado",
    label: "3. Cotizado",
    shortLabel: "Cotizado",
    step: 3,
    color: { bg: "#DBEAFE", text: "#1D4ED8" },
    aliases: ["Cotizado"],
  },
  {
    value: "en_reparacion",
    label: "4. En reparacion",
    shortLabel: "En reparacion",
    step: 4,
    color: { bg: "#FFEDD5", text: "#C2410C" },
    aliases: ["En reparacion", "En reparación"],
  },
  {
    value: "listo",
    label: "5. Listo",
    shortLabel: "Listo",
    step: 5,
    color: { bg: "#DCFCE7", text: "#166534" },
    aliases: ["Listo"],
  },
  {
    value: "entregado",
    label: "6. Entregado",
    shortLabel: "Entregado",
    step: 6,
    color: { bg: "#D1FAE5", text: "#065F46" },
    aliases: ["Entregado"],
    final: true,
  },
  {
    value: "sin_solucion",
    label: "Sin solucion",
    shortLabel: "Sin solucion",
    step: null,
    color: { bg: "#FEE2E2", text: "#B91C1C" },
    aliases: ["Sin solucion", "Sin solución"],
    final: true,
  },
  {
    value: "cancelado",
    label: "Cancelado",
    shortLabel: "Cancelado",
    step: null,
    color: { bg: "#F3F4F6", text: "#4B5563" },
    aliases: ["Cancelado", "Anulado"],
    final: true,
  },
];

export const FINAL_ORDER_STATES = ORDER_STATES
  .filter((state) => state.final)
  .map((state) => state.value);

function stripAccents(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeKey(value) {
  return stripAccents(value)
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");
}

export function normalizeOrderState(value) {
  if (value && typeof value === "object") {
    return normalizeOrderState(value.value || value.estado || value.status || value.label);
  }

  const key = normalizeKey(value);
  const state = ORDER_STATES.find((item) => (
    item.value === key
    || item.aliases.some((alias) => normalizeKey(alias) === key)
  ));

  return state?.value || "recibido";
}

export function getOrderState(value) {
  const normalized = normalizeOrderState(value);
  return ORDER_STATES.find((state) => state.value === normalized) || ORDER_STATES[0];
}

export function getOrderStateLabel(value) {
  return getOrderState(value).label;
}

export function getOrderStateColor(value) {
  return getOrderState(value).color;
}

export function getOrderStateStep(value) {
  return getOrderState(value).step;
}

export function isFinalOrderState(value) {
  return FINAL_ORDER_STATES.includes(normalizeOrderState(value));
}

export function isBackwardTransition(currentValue, nextValue) {
  const currentStep = getOrderStateStep(currentValue);
  const nextStep = getOrderStateStep(nextValue);
  return Number.isInteger(currentStep) && Number.isInteger(nextStep) && nextStep < currentStep;
}
