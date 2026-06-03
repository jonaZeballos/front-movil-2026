import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { formatCurrency } from "./salesApi";
import {
  getReceiptBusinessName,
  getReceiptClientEmailText,
  getReceiptClientName,
  getReceiptClientPhone,
  getReceiptDate,
  getReceiptNumber,
  getReceiptPaymentLabel,
  getReceiptProducts,
  getReceiptSeller,
} from "./receiptFormatters";

export async function createReceiptPdf(receipt) {
  if (!receipt) {
    throw new Error("No hay datos del recibo para generar el PDF.");
  }

  const file = await Print.printToFileAsync({
    html: buildReceiptHtml(receipt),
    base64: false,
  });

  return file.uri;
}

export async function downloadReceiptPdf(receipt) {
  const uri = await createReceiptPdf(receipt);
  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    return uri;
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: "Guardar o compartir recibo",
  });

  return uri;
}

function buildReceiptHtml(receipt) {
  const productsHtml = getReceiptProducts(receipt)
    .map((item) => {
      const quantity = Number(item.quantity || item.cantidad || 0);
      const unitPrice = Number(item.unitPrice || item.precioUnitario || 0);
      const total = Number(item.total || item.subtotal || quantity * unitPrice);

      return `
        <tr>
          <td>
            <strong>${escapeHtml(item.name || item.nombre || item.producto || "Producto")}</strong><br />
            <span>${quantity} x ${formatCurrency(unitPrice)}</span>
          </td>
          <td class="right">${formatCurrency(total)}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; background: #f5f5f7; color: #111111; padding: 24px; }
          .receipt { background: #ffffff; border-radius: 18px; padding: 24px; border: 1px solid #e8e8ee; }
          .header { text-align: center; margin-bottom: 22px; border-bottom: 2px solid #2386F5; padding-bottom: 16px; }
          .title { font-size: 26px; font-weight: bold; color: #2386F5; margin: 0; }
          .number { font-size: 14px; color: #777782; margin-top: 6px; }
          .status { display: inline-block; margin-top: 10px; padding: 7px 14px; border-radius: 999px; background: #ECFDF5; color: #10B981; font-weight: bold; font-size: 13px; }
          .section { margin-top: 20px; }
          .section-title { font-size: 15px; font-weight: bold; margin-bottom: 8px; color: #111111; text-transform: uppercase; }
          .text { font-size: 14px; color: #22222A; margin: 3px 0; }
          .muted { color: #777782; font-size: 12px; margin: 3px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          td { padding: 10px 0; border-bottom: 1px solid #eeeeF4; font-size: 14px; }
          .right { text-align: right; font-weight: bold; }
          .totals { margin-top: 18px; background: #F8F8FB; border-radius: 14px; padding: 16px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
          .grand-total { margin-top: 12px; padding-top: 12px; border-top: 1px solid #ddddE5; font-size: 22px; font-weight: bold; color: #2386F5; }
          .footer { margin-top: 22px; text-align: center; color: #777782; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <h1 class="title">${escapeHtml(getReceiptBusinessName(receipt))}</h1>
            <div class="number">Comprobante de venta ${escapeHtml(getReceiptNumber(receipt))}</div>
            <div class="status">${escapeHtml(receipt.status || "Emitido")}</div>
          </div>

          <div class="section">
            <div class="section-title">Cliente</div>
            <p class="text"><strong>${escapeHtml(getReceiptClientName(receipt))}</strong></p>
            <p class="muted">${escapeHtml(getReceiptClientEmailText(receipt))} | ${escapeHtml(getReceiptClientPhone(receipt))}</p>
            <p class="muted">Venta realizada por: ${escapeHtml(getReceiptSeller(receipt))}</p>
          </div>

          <div class="section">
            <div class="section-title">Detalle de venta</div>
            <table>${productsHtml || "<tr><td>Sin productos registrados</td><td></td></tr>"}</table>
          </div>

          <div class="totals">
            <div class="row"><span>Subtotal</span><strong>${formatCurrency(receipt.subtotal)}</strong></div>
            <div class="row"><span>Descuento</span><strong>- ${formatCurrency(receipt.descuento)}</strong></div>
            <div class="row grand-total"><span>Total pagado</span><span>${formatCurrency(receipt.total)}</span></div>
          </div>

          <div class="footer">
            <p>Metodo de pago: ${escapeHtml(getReceiptPaymentLabel(receipt))}</p>
            <p>Emitido: ${escapeHtml(getReceiptDate(receipt))}</p>
            <p>Gracias por su compra.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
