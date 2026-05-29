export function toDisplayText(value, fallback = "No registrado") {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value).trim();
    return text || fallback;
  }

  if (typeof value === "object") {
    const text = (
      value.nombre ||
      value.razonSocial ||
      value.clientName ||
      value.equipmentName ||
      value.modelo ||
      value.tipo ||
      value.codigo ||
      value.code ||
      value.telefono ||
      ""
    ).toString().trim();

    return text || fallback;
  }

  return fallback;
}

export function getClienteNombre(cliente) {
  return toDisplayText(cliente, "Cliente sin nombre");
}

export function getEquipoNombre(equipo) {
  return toDisplayText(equipo, "Sin equipo");
}

export function getDiagnosticoTexto(value) {
  return toDisplayText(value, "Sin diagnostico");
}

export function getCotizacionValidoHasta(cotizacion) {
  if (!cotizacion) return null;
  if (cotizacion.validoHasta || cotizacion.fechaValidez) {
    return cotizacion.validoHasta || cotizacion.fechaValidez;
  }

  const fechaBase = cotizacion.fechaEmision || cotizacion.fechaCreacion;
  if (!fechaBase) return null;

  const fecha = new Date(fechaBase);
  if (Number.isNaN(fecha.getTime())) return null;

  fecha.setDate(fecha.getDate() + 1);
  return fecha.toISOString();
}

export function isCotizacionActiva(cotizacion) {
  if (!cotizacion) return false;
  if (typeof cotizacion.activa === "boolean") return cotizacion.activa;

  const validoHasta = getCotizacionValidoHasta(cotizacion);
  if (!validoHasta) return false;

  return new Date(validoHasta).getTime() >= Date.now();
}
