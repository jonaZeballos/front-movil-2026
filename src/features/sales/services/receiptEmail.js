import * as MailComposer from "expo-mail-composer";

import { formatCurrency } from "./salesApi";
import { createReceiptPdf } from "./receiptPdf";
import {
  getReceiptBusinessName,
  getReceiptClientEmail,
  getReceiptClientName,
  getReceiptDate,
  getReceiptNumber,
} from "./receiptFormatters";

export async function sendReceiptByEmail(receipt) {
  if (!receipt) {
    throw new Error("No hay datos del recibo para enviar por correo.");
  }

  const email = normalizeEmail(getReceiptClientEmail(receipt));
  if (!email) {
    throw new Error("El cliente no tiene correo registrado");
  }

  const isAvailable = await MailComposer.isAvailableAsync();
  if (!isAvailable) {
    throw new Error("No hay una app de correo disponible en este dispositivo.");
  }

  const attachment = await createReceiptPdf(receipt);

  await MailComposer.composeAsync({
    recipients: [email],
    subject: `Comprobante de venta ${getReceiptNumber(receipt)} - ${getReceiptBusinessName(receipt)}`,
    body: buildEmailBody(receipt),
    attachments: [attachment],
  });

  return true;
}

function buildEmailBody(receipt) {
  return [
    `Estimado/a ${getReceiptClientName(receipt)},`,
    "",
    `Adjuntamos el comprobante de venta ${getReceiptNumber(receipt)}.`,
    "",
    `Total: ${formatCurrency(receipt.total)}`,
    `Fecha de emision: ${getReceiptDate(receipt)}`,
    "",
    `Gracias por confiar en ${getReceiptBusinessName(receipt)}.`,
  ].join("\n");
}

function normalizeEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : "";
}
