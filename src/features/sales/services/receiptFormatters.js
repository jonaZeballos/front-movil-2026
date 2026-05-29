export function toText(value, fallback = "No registrado") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    const text = String(value).trim();
    return text || fallback;
  }
  if (typeof value === "object") {
    return (
      value.nombre ||
      value.razonSocial ||
      value.name ||
      value.username ||
      value.email ||
      value.reciboCodigo ||
      value.number ||
      fallback
    );
  }
  return fallback;
}

export function getReceiptBusiness(receipt = {}) {
  return receipt.negocio || receipt.business || receipt.venta?.negocio || {};
}

export function getReceiptBusinessName(receipt = {}) {
  return toText(getReceiptBusiness(receipt).nombre, "ServiTech");
}

export function getReceiptClient(receipt = {}) {
  return receipt.cliente || receipt.customer || receipt.venta?.cliente || {};
}

export function getReceiptClientName(receipt = {}) {
  const client = getReceiptClient(receipt);
  const fullName = [client.nombres, client.apellidos].filter(Boolean).join(" ").trim();
  return fullName || client.nombre || client.razonSocial || receipt.clienteNombre || "Cliente mostrador";
}

export function getReceiptClientPhone(receipt = {}) {
  const client = getReceiptClient(receipt);
  return toText(client.telefono || client.celular || client.phone, "Sin telefono");
}

export function getReceiptClientEmail(receipt = {}) {
  const client = getReceiptClient(receipt);
  return toText(client.email || client.correo || client.mail, "Sin correo");
}

export function getReceiptSeller(receipt = {}) {
  const user = receipt.realizadoPor || receipt.vendedor || receipt.usuario || receipt.user || {};
  const fullName = [user.nombres, user.apellidos].filter(Boolean).join(" ").trim();
  return fullName || user.nombre || user.name || user.username || user.email || "Usuario no disponible";
}

export function getReceiptNumber(receipt = {}) {
  return toText(receipt.reciboCodigo || receipt.number || receipt.numero || receipt.codigo, "Sin numero");
}

export function getReceiptDate(receipt = {}) {
  const value = receipt.issuedAt || receipt.fechaCreacion || receipt.fecha;
  if (!value) return "Sin fecha";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Sin fecha" : date.toLocaleString("es-BO");
}

export function getReceiptProducts(receipt = {}) {
  return Array.isArray(receipt.productos) ? receipt.productos : Array.isArray(receipt.items) ? receipt.items : [];
}
