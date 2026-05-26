import { apiRequest } from "../../../shared/api/client";

export async function listCotizaciones(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  const cotizaciones = await apiRequest(`/api/cotizaciones${query}`);
  return cotizaciones.map(mapCotizacion);
}

export async function createCotizacion(data) {
  const cotizacion = await apiRequest("/api/cotizaciones", {
    method: "POST",
    body: JSON.stringify({
      ordenId: data.ordenId || data.idOrden || data.order?.id,
      descripcion: data.descripcion,
      manoObra: data.manoObra,
      repuestos: data.repuestos,
      descuento: data.descuento,
      observaciones: data.observaciones,
    }),
  });

  return mapCotizacion(cotizacion);
}

export async function getCotizacionWhatsapp(id) {
  return apiRequest(`/api/cotizaciones/${id}/whatsapp`);
}

export function mapCotizacion(cotizacion) {
  return {
    ...cotizacion,
    id: cotizacion.id,
    numero: cotizacion.numero || cotizacion.codigo || `COT-${cotizacion.numeroInterno || ""}`,
    descripcion: cotizacion.descripcion,
    manoObra: Number(cotizacion.manoObra || 0),
    repuestos: Number(cotizacion.repuestos || 0),
    descuento: Number(cotizacion.descuento || 0),
    total: Number(cotizacion.total || 0),
    estado: cotizacion.estado || "Pendiente",
    order: cotizacion.order || cotizacion.orden,
    orden: cotizacion.orden || cotizacion.order,
    cliente: cotizacion.cliente || cotizacion.orden?.cliente,
    equipo: cotizacion.equipo || cotizacion.orden?.equipo,
  };
}
