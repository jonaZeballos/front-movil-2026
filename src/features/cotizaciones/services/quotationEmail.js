import * as MailComposer from "expo-mail-composer";

import {
  formatQuotationDate,
  formatQuotationMoney,
  getClienteNombre,
  getCotizacionValidoHasta,
  getQuotationBusiness,
  getQuotationClient,
  getQuotationCreator,
  getQuotationEmailText,
  getQuotationEmail,
  getQuotationOrder,
  getQuotationOrders,
  isInternalServitechEmail,
  toDisplayText,
} from "../utils/quotationFormatters";
import { createQuotationPdf } from "./quotationPdf";

export async function sendQuotationByEmail(quotation) {
  if (!quotation) {
    throw new Error("No hay datos de la cotizacion para enviar por correo.");
  }

  const email = normalizeEmail(getQuotationEmail(quotation));
  if (!email) {
    throw new Error("El cliente no tiene correo registrado.");
  }

  const isAvailable = await MailComposer.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("No hay una app de correo disponible en este dispositivo.");
  }

  const attachment = await createQuotationPdf(quotation);

  await MailComposer.composeAsync({
    recipients: [email],
    subject: buildQuotationEmailSubject(quotation),
    body: buildQuotationEmailBody(quotation),
    attachments: [attachment],
  });

  return true;
}

function buildQuotationEmailSubject(quotation) {
  const negocio = getQuotationBusiness(quotation);
  return `Cotizacion ${toDisplayText(quotation.numero, "Sin numero")} - ${toDisplayText(negocio.nombre, "ServiTech")}`;
}

function buildQuotationEmailBody(quotation) {
  const cliente = getQuotationClient(quotation);
  const order = getQuotationOrder(quotation);
  const orders = getQuotationOrders(quotation);
  const negocio = getQuotationBusiness(quotation);
  const validoHasta = getCotizacionValidoHasta(quotation);

  return [
    `Estimado/a ${getClienteNombre(cliente)},`,
    "",
    orders.length > 1
      ? `Adjuntamos la cotizacion ${toDisplayText(quotation.numero, "Sin numero")} correspondiente a ${orders.length} ordenes de servicio.`
      : `Adjuntamos la cotizacion ${toDisplayText(quotation.numero, "Sin numero")} correspondiente a la orden ${toDisplayText(order.code || order.codigo, "Sin codigo")}.`,
    "",
    `Total: ${formatQuotationMoney(quotation.total)}`,
    `Valida hasta: ${formatQuotationDate(validoHasta)}`,
    `Email del cliente: ${getQuotationEmailText(quotation)}`,
    `Cotizacion realizada por: ${getQuotationCreator(quotation)}`,
    "",
    `Gracias por confiar en ${toDisplayText(negocio.nombre, "ServiTech")}.`,
  ].join("\n");
}

function normalizeEmail(value) {
  const email = String(value || "").trim();
  if (isInternalServitechEmail(email)) return "";
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}
