import { apiRequest } from "../../../shared/api/client";

export async function getReportsSummary() {
  return apiRequest("/api/reportes/resumen");
}

export async function getSalesReport(params = {}) {
  const query = buildQuery(params);
  return apiRequest(`/api/reportes/ventas${query}`);
}

export async function getServicesReport(params = {}) {
  const query = buildQuery(params);
  return apiRequest(`/api/reportes/servicios${query}`);
}

export async function getInventoryReport() {
  return apiRequest("/api/reportes/inventario");
}

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const queryString = query.toString();
  return queryString ? `?${queryString}` : "";
}

export function formatReportCurrency(value) {
  const number = Number(value || 0);
  return `Bs ${number.toFixed(2)}`;
}

export function getReportClientName(cliente) {
  if (typeof cliente === "string") return cliente;

  const fullName = [cliente?.nombres, cliente?.apellidos]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || cliente?.nombre || cliente?.razonSocial || cliente?.clienteNombre || "Cliente";
}

export function getPaymentLabel(method) {
  if (!method) return "No registrado";
  if (typeof method === "string") {
    const normalized = method.toLowerCase();
    if (normalized === "efectivo") return "Efectivo";
    if (normalized === "qr") return "QR";
    return method;
  }

  return method.label || method.name || method.id || "No registrado";
}

export function normalizeReportSale(venta = {}) {
  const productosSource = venta.productos || venta.detalles || venta.items || [];
  const productos = productosSource.map((item) => {
    const product = typeof item.producto === "object" && item.producto ? item.producto : {};
    const cantidad = Number(item.cantidad || item.quantity || 0);
    const precioUnitario = Number(item.precioUnitario || item.unitPrice || item.precio || 0);
    const subtotal = Number(item.subtotal || item.total || cantidad * precioUnitario);
    const nombre =
      item.nombre ||
      item.name ||
      product.nombre ||
      (typeof item.producto === "string" ? item.producto : "") ||
      "Producto";

    return {
      ...item,
      id: item.id || item.productoId || item.idProducto || product.id || nombre,
      productoId: item.productoId || item.idProducto || product.id,
      nombre,
      name: nombre,
      cantidad,
      quantity: cantidad,
      precioUnitario,
      unitPrice: precioUnitario,
      subtotal,
      total: subtotal,
    };
  });

  const subtotal = productos.reduce((sum, item) => sum + Number(item.subtotal || 0), 0);
  const total = Number(venta.total || 0);
  const descuento = Number(venta.descuento ?? Math.max(subtotal - total, 0));
  const cliente = venta.cliente || {
    nombre: venta.clienteNombre || venta.customerName || "Cliente mostrador",
    razonSocial: venta.clienteNombre || venta.customerName || "Cliente mostrador",
  };
  const reciboCodigo =
    venta.reciboCodigo ||
    venta.codigo ||
    venta.recibo?.codigo ||
    venta.number ||
    venta.numero;

  return {
    ...venta,
    id: venta.id || reciboCodigo,
    number: reciboCodigo,
    codigo: reciboCodigo,
    reciboCodigo,
    cliente,
    clienteNombre: getReportClientName(cliente),
    productos,
    detalles: productos,
    metodoPago: venta.metodoPago,
    subtotal,
    descuento,
    total,
    totalProductos: productos.reduce((sum, item) => sum + Number(item.cantidad || 0), 0),
    issuedAt: venta.issuedAt || venta.fechaCreacion || venta.createdAt || venta.fecha,
    createdAt: venta.createdAt || venta.fechaCreacion || venta.issuedAt || venta.fecha,
    recibo: venta.recibo || {
      codigo: reciboCodigo,
      fecha: venta.fechaCreacion || venta.issuedAt || venta.createdAt,
      estado: venta.status || "Emitido",
    },
  };
}

export function normalizeReportService(orden = {}) {
  const cliente = orden.cliente || orden.equipo?.cliente || {
    nombre: orden.clienteNombre || orden.clientName || "Cliente no registrado",
    razonSocial: orden.clienteNombre || orden.clientName || "Cliente no registrado",
  };
  const equipoObject = typeof orden.equipo === "object" && orden.equipo ? orden.equipo : null;
  const equipoNombre =
    orden.equipoNombre ||
    equipoObject?.nombre ||
    [equipoObject?.tipo, equipoObject?.marca, equipoObject?.modelo].filter(Boolean).join(" ").trim() ||
    (typeof orden.equipo === "string" ? orden.equipo : "") ||
    "Equipo no registrado";

  return {
    ...orden,
    id: orden.id || orden.codigo || orden.code,
    code: orden.code || (orden.codigo ? `#${String(orden.codigo).padStart(4, "0")}` : "Orden"),
    cliente,
    clienteNombre: getReportClientName(cliente),
    equipo: equipoObject || { nombre: equipoNombre },
    equipoNombre,
    estado: orden.estado || orden.status || "Sin estado",
    status: orden.status || orden.estado || "Sin estado",
    prioridad: orden.prioridad || "Sin prioridad",
    diagnostico: orden.diagnostico || orden.failure || orden.descripcion || "Sin diagnostico",
    descripcion: orden.descripcion || orden.observaciones || orden.diagnostico || "Sin descripcion",
    cotizaciones: Array.isArray(orden.cotizaciones) ? orden.cotizaciones : [],
    totalCotizado: Number(orden.totalCotizado || 0),
    createdAt: orden.createdAt || orden.fechaRecepcion || orden.fecha || orden.updatedAt,
  };
}

export function calculateSalesReport(ventas = []) {
  const normalizedVentas = ventas.map(normalizeReportSale);
  const totalVentas = normalizedVentas.length;
  const totalIngresos = normalizedVentas.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;

  const productosVendidos = normalizedVentas.reduce((sum, venta) => {
    const productos = Array.isArray(venta.productos) ? venta.productos : [];

    return (
      sum +
      productos.reduce((productSum, item) => {
        return productSum + Number(item.quantity || item.cantidad || 0);
      }, 0)
    );
  }, 0);

  const metodosPago = normalizedVentas.reduce((acc, venta) => {
    const label = getPaymentLabel(venta.metodoPago);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});

  return {
    totalVentas,
    totalIngresos,
    promedioVenta,
    productosVendidos,
    metodosPago,
  };
}

export function calculateServicesReport(ordenes = []) {
  const normalizedOrdenes = ordenes.map(normalizeReportService);
  const totalOrdenes = normalizedOrdenes.length;

  const resumenEstados = normalizedOrdenes.reduce((acc, orden) => {
    const estado = orden.status || orden.estado || "Sin estado";
    acc[estado] = (acc[estado] || 0) + 1;
    return acc;
  }, {});

  const pendientes = countStatuses(resumenEstados, [
    "Recibido",
    "En diagnostico",
    "Cotizado",
  ]);

  const enProceso = countStatuses(resumenEstados, ["En reparacion"]);
  const finalizadas = countStatuses(resumenEstados, ["Listo", "Entregado"]);
  const sinSolucion = countStatuses(resumenEstados, ["Sin solucion"]);

  return {
    totalOrdenes,
    pendientes,
    enProceso,
    finalizadas,
    sinSolucion,
    resumenEstados,
  };
}

export function filterReportItemsByPeriod(items = [], period = "todos", getDate) {
  if (period === "todos") return items;

  const now = new Date();

  return items.filter((item) => {
    const rawDate = getDate?.(item);
    if (!rawDate) return false;

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return false;

    if (period === "hoy") {
      return date.toDateString() === now.toDateString();
    }

    if (period === "semana") {
      const diffMs = now.getTime() - date.getTime();
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      return diffDays <= 7;
    }

    if (period === "mes") {
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }

    return true;
  });
}

export function getSaleDate(venta) {
  return venta.issuedAt || venta.createdAt || venta.fecha || venta.fechaEmision;
}

export function getOrderDate(orden) {
  return orden.createdAt || orden.fechaRecepcion || orden.fecha || orden.fecha_creacion || orden.updatedAt;
}

export function formatReportDate(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleDateString("es-BO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function countStatuses(statusMap, statuses = []) {
  const normalizedMap = Object.entries(statusMap).reduce((acc, [key, value]) => {
    acc[normalizeStatus(key)] = Number(value || 0);
    return acc;
  }, {});

  return statuses.reduce((sum, status) => sum + Number(normalizedMap[normalizeStatus(status)] || 0), 0);
}

function normalizeStatus(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
