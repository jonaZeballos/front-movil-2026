import {
  cleanText,
  formatCurrency,
  getClientName,
  getClientPhone,
  getCurrentDateTime,
  getEquipmentName,
  getOrderCode,
  openWhatsApp,
} from "../../../shared/utils";

export function buildQuotationWhatsAppMessage(quotation) {
  if (!quotation) {
    throw new Error("No hay datos de la cotizacion para enviar.");
  }

  const order = quotation.order || {};
  const cliente = quotation.cliente || order.cliente || order.customer || {};
  const equipo = quotation.equipo || order.equipo || order.equipment || {};

  const numero = cleanText(quotation.numero, "Sin numero");
  const clienteNombre = getClientName(cliente);
  const ordenCodigo = getOrderCode(order);
  const equipoNombre = getEquipmentName(equipo);

  const descripcion = cleanText(quotation.descripcion, "Sin descripcion");
  const observaciones = cleanText(quotation.observaciones, "Sin observaciones");

  return [
    `📄 *Cotizacion ${numero}*`,
    "",
    `👤 *Cliente:* ${clienteNombre}`,
    `🧾 *Orden:* ${ordenCodigo}`,
    `🛠️ *Equipo:* ${equipoNombre}`,
    "",
    `*Detalle del servicio:*`,
    descripcion,
    "",
    `💰 *Mano de obra:* ${formatCurrency(quotation.manoObra)}`,
    `🔩 *Repuestos:* ${formatCurrency(quotation.repuestos)}`,
    `🏷️ *Descuento:* ${formatCurrency(quotation.descuento)}`,
    `✅ *Total:* ${formatCurrency(quotation.total)}`,
    "",
    `📝 *Observaciones:*`,
    observaciones,
    "",
    `📅 *Fecha:* ${getCurrentDateTime()}`,
    "",
    "Para aprobar la cotizacion, responde este mensaje con *ACEPTO*.",
  ].join("\n");
}

export function getQuotationClientPhone(quotation) {
  const order = quotation?.order || {};
  const cliente = quotation?.cliente || order.cliente || order.customer || {};

  return getClientPhone(cliente);
}

export async function sendQuotationByWhatsApp(quotation) {
  const message = buildQuotationWhatsAppMessage(quotation);
  const phone = getQuotationClientPhone(quotation);

  return openWhatsApp({ message, phone });
}