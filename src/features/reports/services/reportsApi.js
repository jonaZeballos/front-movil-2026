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
  const fullName = [cliente?.nombres, cliente?.apellidos]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || cliente?.nombre || cliente?.razonSocial || "Cliente";
}

export function getPaymentLabel(method) {
  if (!method) return "No registrado";
  if (typeof method === "string") return method;

  return method.label || method.name || method.id || "No registrado";
}

export function calculateSalesReport(ventas = []) {
  const totalVentas = ventas.length;
  const totalIngresos = ventas.reduce((sum, venta) => sum + Number(venta.total || 0), 0);
  const promedioVenta = totalVentas > 0 ? totalIngresos / totalVentas : 0;

  const productosVendidos = ventas.reduce((sum, venta) => {
    const productos = Array.isArray(venta.productos) ? venta.productos : [];

    return (
      sum +
      productos.reduce((productSum, item) => {
        return productSum + Number(item.quantity || item.cantidad || 0);
      }, 0)
    );
  }, 0);

  const metodosPago = ventas.reduce((acc, venta) => {
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
  const totalOrdenes = ordenes.length;

  const resumenEstados = ordenes.reduce((acc, orden) => {
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
  return orden.createdAt || orden.fecha || orden.fecha_creacion || orden.updatedAt;
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
  return statuses.reduce((sum, status) => sum + Number(statusMap[status] || 0), 0);
}
