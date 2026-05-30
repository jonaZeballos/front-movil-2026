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

export function formatQuotationDate(value, fallback = "Sin fecha") {
  if (!value) return fallback;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;

  return date.toLocaleDateString("es-BO");
}

export function formatQuotationMoney(value) {
  const number = Number(value || 0);
  return `Bs. ${Number.isFinite(number) ? number.toFixed(2) : "0.00"}`;
}

export function getQuotationOrder(quotation = {}) {
  return quotation.order || quotation.orden || {};
}

export function getQuotationOrders(quotation = {}) {
  const orders = quotation.orders || quotation.ordenes;
  if (Array.isArray(orders) && orders.length) return orders;

  const order = getQuotationOrder(quotation);
  return order?.id ? [order] : [];
}

export function getQuotationClient(quotation = {}) {
  const order = getQuotationOrder(quotation);
  return quotation.cliente || order.cliente || order.customer || {};
}

export function getQuotationEquipment(quotation = {}) {
  const order = getQuotationOrder(quotation);
  return quotation.equipo || order.equipo || order.equipment || {};
}

export function getQuotationBusiness(quotation = {}) {
  const order = getQuotationOrder(quotation);
  return quotation.negocio || order.negocio || {};
}

export function getQuotationSubtotal(quotation = {}) {
  return Number(quotation.manoObra || 0) + Number(quotation.repuestos || 0);
}

export function getQuotationPhone(quotation = {}) {
  const cliente = getQuotationClient(quotation);
  return toDisplayText(cliente.telefono || cliente.celular || cliente.phone, "Sin telefono");
}

export function getQuotationEmail(quotation = {}) {
  const cliente = getQuotationClient(quotation);
  return toDisplayText(cliente.email || cliente.correo || cliente.mail, "Sin correo");
}

export function getUserDisplayName(user = {}) {
  const fullName = [user.nombres, user.apellidos].filter(Boolean).join(" ").trim();
  return fullName || user.nombre || user.name || user.username || user.email || "Usuario no disponible";
}

export function getQuotationCreator(quotation = {}) {
  return getUserDisplayName(
    quotation.realizadoPor ||
      quotation.creadoPor ||
      quotation.usuarioCreacion ||
      quotation.usuario ||
      quotation.user ||
      {}
  );
}
