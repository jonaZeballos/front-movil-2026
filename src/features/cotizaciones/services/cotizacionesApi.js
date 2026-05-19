import { apiRequest } from "../../../shared/api/client";

export function listCotizaciones(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/cotizaciones${query}`).then((cotizaciones) =>
    cotizaciones.map(mapCotizacion)
  );
}

export function createCotizacion(cotizacionData) {
  return apiRequest("/api/cotizaciones", {
    method: "POST",
    body: JSON.stringify({
      ordenId: cotizacionData.ordenId || cotizacionData.order?.id,
      descripcion: cotizacionData.descripcion,
      manoObra: cotizacionData.manoObra,
      repuestos: cotizacionData.repuestos,
      descuento: cotizacionData.descuento || 0,
      observaciones: cotizacionData.observaciones,
    }),
  }).then(mapCotizacion);
}

function mapCotizacion(cotizacion) {
  return {
    ...cotizacion,
    order: cotizacion.order || cotizacion.orden,
    total: Number(cotizacion.total || 0),
  };
}
