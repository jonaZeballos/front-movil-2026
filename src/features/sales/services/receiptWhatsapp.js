import {
  cleanText,
  formatCurrency,
  formatDateTime,
  getClientName,
  getClientPhone,
  openWhatsApp,
} from "../../../shared/utils";

export function buildReceiptWhatsAppMessage(receipt) {
  if (!receipt) {
    throw new Error("No hay datos del recibo para enviar.");
  }

  const clienteNombre = getClientName(receipt.cliente);
  const productos = Array.isArray(receipt.productos) ? receipt.productos : [];

  const productosText =
    productos.length > 0
      ? productos.map((item, index) => {
          const name = cleanText(item.name || item.nombre, "Producto");
          const quantity = Number(item.quantity || item.cantidad || 0);
          const unitPrice = Number(item.unitPrice || item.precioUnitario || 0);
          const total = Number(item.total || quantity * unitPrice || 0);

          return `${index + 1}. ${name} - ${quantity} x ${formatCurrency(unitPrice)} = ${formatCurrency(total)}`;
        })
      : ["Sin productos registrados"];

  return [
    `🧾 *Recibo electronico*`,
    "",
    `*Nro:* ${cleanText(receipt.number || receipt.numero, "Sin numero")}`,
    `*Estado:* ${cleanText(receipt.status || receipt.estado, "Emitido")}`,
    "",
    `👤 *Cliente:* ${clienteNombre}`,
    "",
    `*Detalle de venta:*`,
    ...productosText,
    "",
    `💰 *Subtotal:* ${formatCurrency(receipt.subtotal)}`,
    `🏷️ *Descuento:* ${formatCurrency(receipt.descuento)}`,
    `✅ *Total pagado:* ${formatCurrency(receipt.total)}`,
    "",
    `💳 *Metodo de pago:* ${getPaymentLabel(receipt.metodoPago)}`,
    `📅 *Emitido:* ${formatDateTime(receipt.issuedAt || receipt.fecha)}`,
    "",
    "Gracias por su compra.",
  ].join("\n");
}

export function getReceiptClientPhone(receipt) {
  return getClientPhone(receipt?.cliente);
}

export async function sendReceiptByWhatsApp(receipt) {
  const message = buildReceiptWhatsAppMessage(receipt);
  const phone = getReceiptClientPhone(receipt);

  return openWhatsApp({ message, phone });
}

function getPaymentLabel(method) {
  if (!method) return "No registrado";
  if (typeof method === "string") return method;

  return method.label || method.name || method.id || "No registrado";
}