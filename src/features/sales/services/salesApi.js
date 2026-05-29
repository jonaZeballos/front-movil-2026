import { apiRequest } from "../../../shared/api/client";

export const paymentMethods = [
  { id: "efectivo", label: "Efectivo", iconName: "cash-outline" },
  { id: "qr", label: "Pago QR", iconName: "qr-code-outline" },
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
    }),
  });

  return mapVenta(venta);
}

export const createVenta = createSale;

export async function generateReceipt(saleId) {
  const receipt = await apiRequest(`/api/ventas/${saleId}/recibo`);
  return mapReceipt(receipt);
}

export function buildElectronicReceipt(saleDraft, savedSale = {}) {
  const receipt = savedSale.recibo || savedSale.receipt || savedSale;

  return mapReceipt({
    id: receipt.id || savedSale.id || `receipt-${Date.now()}`,
    saleId: savedSale.id || savedSale.ventaId || `sale-${Date.now()}`,
    number: receipt.number || savedSale.reciboCodigo,
    numero: receipt.numero || savedSale.numero,
    reciboCodigo: receipt.reciboCodigo || savedSale.reciboCodigo,
    issuedAt: receipt.issuedAt || savedSale.fechaCreacion || new Date().toISOString(),
    cliente: saleDraft.cliente || savedSale.cliente,
    productos: saleDraft.productos || savedSale.productos || savedSale.detalles || [],
    metodoPago: saleDraft.metodoPago,
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
    issuedAt: venta.fechaCreacion,
    createdAt: venta.fechaCreacion,
    cliente: venta.cliente || {
      id: venta.idCliente,
      nombre: venta.clienteNombre || "Cliente mostrador",
    },
    productos: productos.map(mapVentaDetalle),
    total: Number(venta.total || 0),
    subtotal: productos.reduce((sum, item) => sum + Number(item.subtotal || item.total || 0), 0),
    descuento: Number(venta.descuento || 0),
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
    issuedAt: source.issuedAt || source.fechaCreacion || venta.fechaCreacion || new Date().toISOString(),
    cliente: source.cliente || venta.cliente || {
      id: venta.idCliente,
      nombre: venta.clienteNombre || "Cliente mostrador",
    },
    productos: productos.map(mapVentaDetalle),
    metodoPago: source.metodoPago || "No registrado",
    negocio: source.negocio || venta.negocio,
    realizadoPor: source.realizadoPor || venta.realizadoPor,
    subtotal: Number(source.subtotal || venta.subtotal || venta.total || 0),
    descuento: Number(source.descuento || venta.descuento || 0),
    total: Number(source.total || venta.total || 0),
    status: source.status || source.estado || "Emitido",
  };
}
