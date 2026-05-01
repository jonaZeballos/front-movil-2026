import { apiRequest } from "../../../shared/api/client";

export function listEquipos(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/equipos${query}`).then((equipos) => equipos.map(mapEquipo));
}

export function createEquipo(equipoData) {
  return apiRequest("/api/equipos", {
    method: "POST",
    body: JSON.stringify({
      clienteId: equipoData.clienteId,
      tipo: equipoData.tipo || equipoData.type,
      marca: equipoData.marca || equipoData.brand,
      modelo: equipoData.modelo || equipoData.model,
      nroSerie: equipoData.nroSerie || equipoData.serial,
    }),
  }).then(mapEquipo);
}

function mapEquipo(equipo) {
  return {
    ...equipo,
    clientName: equipo.clientName,
    type: equipo.type || equipo.tipo,
    brand: equipo.brand || equipo.marca,
    model: equipo.model || equipo.modelo,
    serial: equipo.serial || equipo.nroSerie,
    failure: equipo.failure || "",
  };
}
