import { apiRequest } from "../../../shared/api/client";

export const paymentMethods = [
  { id: "efectivo", label: "Efectivo", iconName: "cash-outline" },
  { id: "qr", label: "QR", iconName: "qr-code-outline" },
  { id: "tarjeta", label: "Tarjeta", iconName: "card-outline" },
  { id: "transferencia", label: "Transferencia", iconName: "card-outline" },
];

export function formatCurrency(value) {
  const number = Number(value || 0);
  return `Bs ${number.toFixed(2)}`;
}

export async function listVentas() {
  const ventas = await apiRequest("/api/ventas");
  return ventas.map(mapVenta);
}

export async function createSale(saleDraft) {
  const venta = await apiRequest("/api/ventas", {
    method: "POST",
    body: JSON.stringify({
      clienteId: saleDraft.clienteId,
      clienteNombre: saleDraft.clienteNombre,
      items: saleDraft.productos || saleDraft.items || [],
      descuento: saleDraft.descuento,
      metodoPago: getPaymentMethodId(saleDraft.metodoPago ?? saleDraft.paymentMethod),
    }),
  });

  return mapVenta(venta);
}

export const createVenta = createSale;

export async function generateReceipt(saleId) {
  const receipt = await apiRequest(`/api/ventas/${saleId}/recibo`);
  return mapReceipt(receipt);
}

function isInternalServitechEmail(email) {
  return /@servitech\.local$/i.test(String(email || "").trim());
}

function getRealClientEmail(client = {}) {
  const candidates = [client.email, client.correo, client.emailReal, client.mail];
  return candidates
    .map((value) => String(value || "").trim())
    .find((value) => value && !isInternalServitechEmail(value)) || "";
}

function mapClient(client = {}) {
  const email = getRealClientEmail(client);

  return {
    ...client,
    email: email || null,
    correo: email || null,
  };
}

function getPaymentMethodId(method) {
  if (!method) return null;
  if (typeof method === "string") return method;
  return method.id || method.value || method.label || method.name || null;
}

function normalizePaymentMethod(method) {
  if (!method) return null;
  if (typeof method === "object") return method;

  const text = String(method).trim();
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const known = paymentMethods.find(
    (item) => item.id === normalized || item.label.toLowerCase() === normalized
  );

  return known || { id: normalized || text, label: text };
}

export function buildElectronicReceipt(saleDraft, savedSale = {}) {
  const receipt = savedSale.recibo || savedSale.receipt || savedSale;

  return mapReceipt({
    id: receipt.id || savedSale.id || `receipt-${Date.now()}`,
    saleId: savedSale.id || savedSale.ventaId || `sale-${Date.now()}`,
    number: receipt.number || savedSale.reciboCodigo,
    numero: receipt.numero || savedSale.numero,
    reciboCodigo: receipt.reciboCodigo || savedSale.reciboCodigo,
    issuedAt: receipt.issuedAt || savedSale.fechaCreacion || null,
    cliente: mapClient(saleDraft.cliente || savedSale.cliente || {}),
    productos: saleDraft.productos || savedSale.productos || savedSale.detalles || [],
    metodoPago: normalizePaymentMethod(receipt.metodoPago || savedSale.metodoPago || saleDraft.metodoPago),
    subtotal: saleDraft.subtotal,
    descuento: saleDraft.descuento,
    total: saleDraft.total || savedSale.total,
    status: "Emitido",
  });
}

function mapVenta(venta) {
  const productos = venta.productos || venta.detalles || [];
  return {
    ...venta,
    id: venta.id,
    number: venta.reciboCodigo || venta.numero,
    numero: venta.numero,
    reciboCodigo: venta.reciboCodigo,
    issuedAt: venta.fechaCreacion || null,
    createdAt: venta.fechaCreacion,
    cliente: mapClient(venta.cliente || {
      id: venta.idCliente,
      nombre: venta.clienteNombre || "Cliente mostrador",
    }),
    productos: productos.map(mapVentaDetalle),
    total: Number(venta.total || 0),
    subtotal: productos.reduce((sum, item) => sum + Number(item.subtotal || item.total || 0), 0),
    descuento: Number(venta.descuento || 0),
    metodoPago: normalizePaymentMethod(venta.metodoPago),
    status: venta.status || "Emitido",
  };
}

function mapVentaDetalle(item) {
  const product = typeof item.producto === "object" ? item.producto : item;
  const quantity = Number(item.quantity || item.cantidad || 0);
  const unitPrice = Number(item.unitPrice || item.precioUnitario || item.precio || 0);

  return {
    id: item.id || item.idProducto || product.id,
    productoId: item.productoId || item.idProducto || product.id,
    name: item.name || item.nombre || (typeof item.producto === "string" ? item.producto : product.nombre) || "Producto",
    nombre: item.nombre || (typeof item.producto === "string" ? item.producto : product.nombre) || item.name || "Producto",
    quantity,
    cantidad: quantity,
    unitPrice,
    precioUnitario: unitPrice,
    total: Number(item.total || item.subtotal || quantity * unitPrice),
    subtotal: Number(item.subtotal || item.total || quantity * unitPrice),
  };
}

function mapReceipt(receipt) {
  const source = receipt.recibo || receipt;
  const venta = source.venta || source;
  const productos = source.productos || source.items || source.detalles || venta.productos || venta.items || venta.detalles || [];

  return {
    ...source,
    id: source.id || venta.id,
    saleId: source.saleId || venta.id,
    number: source.number || source.reciboCodigo || venta.reciboCodigo || `REC-${Date.now()}`,
    issuedAt: source.issuedAt || source.fechaCreacion || venta.fechaCreacion || null,
    cliente: mapClient(source.cliente || venta.cliente || {
      id: venta.idCliente,
      nombre: venta.clienteNombre || "Cliente mostrador",
    }),
    productos: productos.map(mapVentaDetalle),
    metodoPago: normalizePaymentMethod(source.metodoPago || venta.metodoPago),
    negocio: source.negocio || venta.negocio,
    realizadoPor: source.realizadoPor || venta.realizadoPor,
    subtotal: Number(source.subtotal || venta.subtotal || venta.total || 0),
    descuento: Number(source.descuento || venta.descuento || 0),
    total: Number(source.total || venta.total || 0),
    status: source.status || source.estado || "Emitido",
  };
}
