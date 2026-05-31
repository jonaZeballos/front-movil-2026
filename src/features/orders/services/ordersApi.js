import { apiRequest } from "../../../shared/api/client";

export const orderStatuses = [
  "Recibido",
  "Cotizado",
  "Listo",
  "Entregado",
  "Sin solucion",
];

export function listOrdenes(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/ordenes${query}`).then((ordenes) => ordenes.map(mapOrden));
}

export function createOrden(orderData) {
  return apiRequest("/api/ordenes", {
    method: "POST",
    body: JSON.stringify({
      equipoId: orderData.equipoId,
      diagnostico: orderData.diagnostico || orderData.failure,
      prioridad: orderData.prioridad || "Normal",
      estado: orderData.estado || "Recibido",
      observaciones: orderData.observaciones,
      garantiaDias: orderData.garantiaDias || 0,
    }),
  }).then(mapOrden);
}

export function createOrdenesLote(orderData) {
  return apiRequest("/api/ordenes/lote", {
    method: "POST",
    body: JSON.stringify({
      equipoIds: orderData.equipoIds || [],
      diagnostico: orderData.diagnostico || orderData.failure,
      prioridad: orderData.prioridad || "Normal",
      estado: orderData.estado || "Recibido",
      observaciones: orderData.observaciones,
      garantiaDias: orderData.garantiaDias || 0,
    }),
  }).then((ordenes) => ordenes.map(mapOrden));
}

export function updateOrden(orderId, data) {
  return apiRequest(`/api/ordenes/${orderId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }).then(mapOrden);
}

export function updateEstadoOrden(orderId, estado) {
  return apiRequest(`/api/ordenes/${orderId}/estado`, {
    method: "PATCH",
    body: JSON.stringify({ estado }),
  }).then(mapOrden);
}

function mapOrden(orden) {
  const equipmentName = orden.equipmentName || orden.equipoNombre || orden.equipo?.nombre || orden.equipo?.modelo || "Equipo";
  const cliente = orden.cliente && typeof orden.cliente === "object" ? orden.cliente : null;
  const clientName = orden.clientName || orden.clienteNombre || cliente?.nombre || cliente?.razonSocial || orden.equipo?.cliente?.nombre || "Cliente";
  const status = orden.status || orden.estado;
  const failure = orden.failure || orden.diagnostico;

  return {
    ...orden,
    code: orden.code || `#${String(orden.codigo).padStart(4, "0")}`,
    codigo: orden.codigo || orden.code,
    status,
    estado: status,
    failure,
    falla: failure,
    diagnostico: orden.diagnostico || failure,
    clientName,
    cliente,
    clienteNombre: clientName,
    equipmentName,
    equipo: equipmentName,
    equipmentSerial: orden.equipmentSerial || orden.equipo?.nroSerie || orden.equipo?.serial,
    observations: orden.observaciones || [],
    cotizaciones: orden.cotizaciones || [],
    cotizacion: orden.cotizacion || orden.cotizaciones?.[0] || null,
  };
}
