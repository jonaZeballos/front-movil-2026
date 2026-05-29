import { cleanText, formatCurrency, getClientPhone, openWhatsApp } from "../../../shared/utils";
import {
  getReceiptBusinessName,
  getReceiptClient,
  getReceiptClientName,
  getReceiptDate,
  getReceiptNumber,
  getReceiptProducts,
  getReceiptSeller,
} from "./receiptFormatters";

export function buildReceiptWhatsAppMessage(receipt) {
  if (!receipt) {
    throw new Error("No hay datos del recibo para enviar.");
  }

  const productos = getReceiptProducts(receipt);
  const productosText = productos.length
    ? productos.map((item, index) => {
        const name = cleanText(item.name || item.nombre || item.producto, "Producto");
        const quantity = Number(item.quantity || item.cantidad || 0);
        const unitPrice = Number(item.unitPrice || item.precioUnitario || 0);
        const total = Number(item.total || item.subtotal || quantity * unitPrice || 0);

        return `${index + 1}. ${name} - ${quantity} x ${formatCurrency(unitPrice)} = ${formatCurrency(total)}`;
      })
    : ["Sin productos registrados"];

  return [
    `*${getReceiptBusinessName(receipt)} - Comprobante de venta ${getReceiptNumber(receipt)}*`,
    `Emitido: ${getReceiptDate(receipt)}`,
    "",
    `Cliente: ${getReceiptClientName(receipt)}`,
    `Venta realizada por: ${getReceiptSeller(receipt)}`,
    "",
    "Detalle de venta:",
    ...productosText,
    "",
    `Subtotal: ${formatCurrency(receipt.subtotal)}`,
    `Descuento: ${formatCurrency(receipt.descuento)}`,
    `Total pagado: ${formatCurrency(receipt.total)}`,
    `Metodo de pago: ${getPaymentLabel(receipt.metodoPago)}`,
    "",
    "Gracias por su compra.",
  ].join("\n");
}

export function getReceiptClientPhone(receipt) {
  return getClientPhone(getReceiptClient(receipt));
}

export async function sendReceiptByWhatsApp(receipt) {
  const phone = getReceiptClientPhone(receipt);
  if (!phone) {
    throw new Error("El cliente no tiene telefono registrado");
  }

  return openWhatsApp({ message: buildReceiptWhatsAppMessage(receipt), phone });
}

function getPaymentLabel(method) {
  if (!method) return "No registrado";
  if (typeof method === "string") return method;

  return method.label || method.name || method.id || "No registrado";
}
