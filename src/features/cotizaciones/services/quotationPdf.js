import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

import {
  formatQuotationDate,
  formatQuotationMoney,
  getClienteNombre,
  getCotizacionValidoHasta,
  getDiagnosticoTexto,
  getEquipoNombre,
  getQuotationBusiness,
  getQuotationClient,
  getQuotationCreator,
  getQuotationEquipment,
  getQuotationOrder,
  getQuotationPhone,
  getQuotationSubtotal,
  toDisplayText,
} from "../utils/quotationFormatters";

export async function shareQuotationPdf(quotation) {
  if (!quotation) {
    throw new Error("No hay datos de la cotizacion para generar el PDF.");
  }

  const uri = await createQuotationPdf(quotation);
  const canShare = await Sharing.isAvailableAsync();

  if (!canShare) {
    throw new Error("Este dispositivo no permite compartir archivos PDF.");
  }

  await Sharing.shareAsync(uri, {
    mimeType: "application/pdf",
    UTI: "com.adobe.pdf",
    dialogTitle: "Compartir cotizacion",
  });

  return uri;
}

export async function createQuotationPdf(quotation) {
  if (!quotation) {
    throw new Error("No hay datos de la cotizacion para generar el PDF.");
  }

  const html = buildQuotationPdfHtml(quotation);
  const file = await Print.printToFileAsync({ html, base64: false });

  return file.uri;
}

function buildQuotationPdfHtml(quotation) {
  const order = getQuotationOrder(quotation);
  const cliente = getQuotationClient(quotation);
  const equipo = getQuotationEquipment(quotation);
  const negocio = getQuotationBusiness(quotation);
  const validoHasta = getCotizacionValidoHasta(quotation);
  const subtotal = getQuotationSubtotal(quotation);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Arial, sans-serif; background: #f4f5fb; color: #111827; padding: 24px; }
          .doc { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 18px; padding: 28px; }
          .header { text-align: center; border-bottom: 2px solid #5655B9; padding-bottom: 18px; margin-bottom: 22px; }
          .business { font-size: 24px; font-weight: 800; color: #5655B9; }
          .title { font-size: 18px; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
          .number { margin-top: 8px; color: #4b5563; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
          .box { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; }
          .section { font-size: 14px; font-weight: 800; color: #5655B9; margin-bottom: 10px; text-transform: uppercase; }
          .row { display: flex; justify-content: space-between; border-bottom: 1px solid #f0f1f5; padding: 8px 0; gap: 16px; }
          .row:last-child { border-bottom: 0; }
          .label { color: #6b7280; font-size: 12px; }
          .value { color: #111827; font-size: 13px; font-weight: 700; text-align: right; }
          .description { border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px; margin-bottom: 18px; }
          .costs { width: 100%; border-collapse: collapse; margin-top: 4px; }
          .costs th { text-align: left; background: #eef2ff; color: #3730a3; padding: 10px; font-size: 12px; }
          .costs td { padding: 11px 10px; border-bottom: 1px solid #f0f1f5; font-size: 13px; }
          .right { text-align: right; font-weight: 800; }
          .total { font-size: 18px; color: #5655B9; }
          .note { margin-top: 18px; background: #f9fafb; border-radius: 12px; padding: 14px; font-size: 12px; color: #374151; }
        </style>
      </head>
      <body>
        <div class="doc">
          <div class="header">
            <div class="business">${escapeHtml(toDisplayText(negocio.nombre, "ServiTech"))}</div>
            <div class="title">Cotizacion</div>
            <div class="number">${escapeHtml(toDisplayText(quotation.numero, "Sin numero"))}</div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="section">Fechas</div>
              ${row("Fecha de emision", formatQuotationDate(quotation.fechaEmision || quotation.fechaCreacion))}
              ${row("Valida hasta", formatQuotationDate(validoHasta))}
              ${row("Estado", quotation.activa ? "Activa" : "Vencida")}
            </div>
            <div class="box">
              <div class="section">Cliente</div>
              ${row("Nombre", getClienteNombre(cliente))}
              ${row("Telefono", getQuotationPhone(quotation))}
              ${row("Realizada por", getQuotationCreator(quotation))}
            </div>
          </div>

          <div class="grid">
            <div class="box">
              <div class="section">Orden</div>
              ${row("Codigo", toDisplayText(order.code || order.codigo, "Sin codigo"))}
              ${row("Equipo", getEquipoNombre(equipo || order.equipo || order.equipmentName))}
              ${row("Diagnostico", getDiagnosticoTexto(order.diagnostico || order.failure))}
            </div>
            <div class="box">
              <div class="section">Servicio</div>
              ${row("Descripcion", toDisplayText(quotation.descripcion, "Sin descripcion"))}
              ${row("Observaciones", toDisplayText(quotation.observaciones, "Sin observaciones"))}
            </div>
          </div>

          <div class="box">
            <div class="section">Costos</div>
            <table class="costs">
              <tr><th>Concepto</th><th class="right">Monto</th></tr>
              <tr><td>Mano de obra</td><td class="right">${formatQuotationMoney(quotation.manoObra)}</td></tr>
              <tr><td>Repuestos/productos</td><td class="right">${formatQuotationMoney(quotation.repuestos)}</td></tr>
              <tr><td>Subtotal</td><td class="right">${formatQuotationMoney(subtotal)}</td></tr>
              <tr><td>Descuento</td><td class="right">${formatQuotationMoney(quotation.descuento)}</td></tr>
              <tr><td>Total</td><td class="right total">${formatQuotationMoney(quotation.total)}</td></tr>
            </table>
          </div>

          <div class="note">Cotizacion valida hasta ${escapeHtml(formatQuotationDate(validoHasta))}.</div>
        </div>
      </body>
    </html>
  `;
}

function row(label, value) {
  return `
    <div class="row">
      <span class="label">${escapeHtml(label)}</span>
      <span class="value">${escapeHtml(toDisplayText(value))}</span>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
