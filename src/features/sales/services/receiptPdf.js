import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import { formatCurrency } from "../services/salesApi";

export async function downloadReceiptPdf(receipt) {
  if (!receipt) {
    throw new Error("No hay datos del recibo para generar el PDF.");
  }

  const html = buildReceiptHtml(receipt);

  const file = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const isSharingAvailable = await Sharing.isAvailableAsync();

  if (!isSharingAvailable) {
    return file.uri;
  }

  await Sharing.shareAsync(file.uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: "Guardar o compartir recibo",
  });

  return file.uri;
}

function buildReceiptHtml(receipt) {
  const clientName = getClientName(receipt.cliente);
  const issuedDate = receipt.issuedAt
    ? new Date(receipt.issuedAt).toLocaleString()
    : "Fecha no disponible";

  const productsHtml = (receipt.productos || [])
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHtml(item.name)}</strong><br />
            <span>${item.quantity} x ${formatCurrency(item.unitPrice)}</span>
          </td>
          <td class="right">${formatCurrency(item.total)}</td>
        </tr>
      `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f5f5f7;
            color: #111111;
            padding: 24px;
          }

          .receipt {
            background: #ffffff;
            border-radius: 18px;
            padding: 24px;
            border: 1px solid #e8e8ee;
          }

          .header {
            text-align: center;
            margin-bottom: 22px;
          }

          .title {
            font-size: 26px;
            font-weight: bold;
            color: #2386F5;
            margin: 0;
          }

          .number {
            font-size: 14px;
            color: #777782;
            margin-top: 6px;
          }

          .status {
            display: inline-block;
            margin-top: 10px;
            padding: 7px 14px;
            border-radius: 999px;
            background: #ECFDF5;
            color: #10B981;
            font-weight: bold;
            font-size: 13px;
          }

          .section {
            margin-top: 20px;
          }

          .section-title {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 8px;
            color: #111111;
          }

          .text {
            font-size: 14px;
            color: #22222A;
            margin: 3px 0;
          }

          .muted {
            color: #777782;
            font-size: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
          }

          td {
            padding: 10px 0;
            border-bottom: 1px solid #eeeeF4;
            font-size: 14px;
          }

          .right {
            text-align: right;
            font-weight: bold;
          }

          .totals {
            margin-top: 18px;
            background: #F8F8FB;
            border-radius: 14px;
            padding: 16px;
          }

          .row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 14px;
          }

          .grand-total {
            margin-top: 12px;
            padding-top: 12px;
            border-top: 1px solid #ddddE5;
            font-size: 22px;
            font-weight: bold;
            color: #2386F5;
          }

          .footer {
            margin-top: 22px;
            text-align: center;
            color: #777782;
            font-size: 12px;
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <div class="header">
            <h1 class="title">Recibo electrónico</h1>
            <div class="number">${escapeHtml(receipt.number || "Sin número")}</div>
            <div class="status">${escapeHtml(receipt.status || "Emitido")}</div>
          </div>

          <div class="section">
            <div class="section-title">Cliente</div>
            <p class="text"><strong>${escapeHtml(clientName)}</strong></p>
            <p class="muted">${escapeHtml(receipt.cliente?.email || "Sin correo registrado")}</p>
          </div>

          <div class="section">
            <div class="section-title">Detalle de venta</div>
            <table>
              ${productsHtml}
            </table>
          </div>

          <div class="totals">
            <div class="row">
              <span>Subtotal</span>
              <strong>${formatCurrency(receipt.subtotal)}</strong>
            </div>

            <div class="row">
              <span>Descuento</span>
              <strong>- ${formatCurrency(receipt.descuento)}</strong>
            </div>

            <div class="row grand-total">
              <span>Total pagado</span>
              <span>${formatCurrency(receipt.total)}</span>
            </div>
          </div>

          <div class="footer">
            <p>Método de pago: ${escapeHtml(getPaymentLabel(receipt.metodoPago))}</p>
            <p>Emitido: ${escapeHtml(issuedDate)}</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function getClientName(cliente) {
  const fullName = [cliente?.nombres, cliente?.apellidos].filter(Boolean).join(" ").trim();
  return fullName || cliente?.nombre || cliente?.razonSocial || "Cliente mostrador";
}

function getPaymentLabel(method) {
  if (!method) return "No registrado";
  if (typeof method === "string") return method;
  return method.label || method.id || "No registrado";
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
