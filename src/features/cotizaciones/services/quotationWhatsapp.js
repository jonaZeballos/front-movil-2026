import {
  cleanText,
  formatCurrency,
  getClientName,
  getClientPhone,
  getEquipmentName,
  getOrderCode,
  normalizeWhatsAppPhone,
  openWhatsApp,
} from "../../../shared/utils";
import { getQuotationCreator } from "../utils/quotationFormatters";
import { getCotizacionWhatsapp } from "./cotizacionesApi";

export function buildQuotationWhatsAppMessage(quotation) {
  if (!quotation) {
    throw new Error("No hay datos de la cotizacion para enviar.");
  }

  const order = quotation.order || quotation.orden || {};
  const cliente = quotation.cliente || order.cliente || order.customer || {};
  const equipo = quotation.equipo || order.equipo || order.equipment || {};
  const negocio = quotation.negocio || order.negocio || {};
  const phone = normalizeWhatsAppPhone(getClientPhone(cliente));
  const emitida = new Date(quotation.fechaCreacion || Date.now());
  const validaHasta = new Date(emitida);
  validaHasta.setDate(validaHasta.getDate() + 1);

  const subtotal = Number(quotation.manoObra || 0) + Number(quotation.repuestos || 0);

  return [
    `*${cleanText(negocio.nombre, "ServiTech")} - Cotizacion ${cleanText(quotation.numero, "Sin numero")}*`,
    `Fecha de emision: ${emitida.toLocaleDateString("es-BO")}`,
    `Fecha de validez: ${validaHasta.toLocaleDateString("es-BO")}`,
    "",
    `Cliente: ${getClientName(cliente)}`,
    `Telefono: ${phone || "No registrado"}`,
    `Cotizacion realizada por: ${getQuotationCreator(quotation)}`,
    `Orden: ${getOrderCode(order)}`,
    `Equipo: ${getEquipmentName(equipo)}`,
    `Diagnostico: ${cleanText(order.diagnostico || order.failure, "No registrado")}`,
    "",
    "Detalle del servicio:",
    cleanText(quotation.descripcion, "Sin descripcion"),
    "",
    `Mano de obra: ${formatCurrency(quotation.manoObra)}`,
    `Repuestos/productos: ${formatCurrency(quotation.repuestos)}`,
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Descuento: ${formatCurrency(quotation.descuento)}`,
    `Total: ${formatCurrency(quotation.total)}`,
    "",
    `Observaciones: ${cleanText(quotation.observaciones, "Sin observaciones")}`,
    "",
    `Cotizacion valida hasta ${validaHasta.toLocaleDateString("es-BO")}.`,
  ].join("\n");
}

export function getQuotationClientPhone(quotation) {
  const order = quotation?.order || quotation?.orden || {};
  const cliente = quotation?.cliente || order.cliente || order.customer || {};

  return getClientPhone(cliente);
}

export async function sendQuotationByWhatsApp(quotation) {
  const remote = quotation?.id ? await getCotizacionWhatsapp(quotation.id).catch(() => null) : null;
  const message = remote?.mensaje || buildQuotationWhatsAppMessage(quotation);
  const phone = getQuotationClientPhone(remote?.cotizacion || quotation) || getPhoneFromWaUrl(remote?.whatsappUrl);

  if (!phone) {
    throw new Error("El cliente no tiene teléfono registrado");
  }

  return openWhatsApp({ message, phone });
}

function getPhoneFromWaUrl(url) {
  const match = String(url || "").match(/wa\.me\/(\d+)/);
  return match?.[1] || "";
}
