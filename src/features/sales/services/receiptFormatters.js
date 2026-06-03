import { formatDateTime } from "../../../shared/utils/dates";
import { getUserDisplayName } from "../../../shared/utils/formatters";

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

export function isInternalServitechEmail(email) {
  return /@servitech\.local$/i.test(String(email || "").trim());
}

export function getRealEmail(...values) {
  for (const value of values) {
    const email = String(value || "").trim();
    if (email && !isInternalServitechEmail(email)) {
      return email;
    }
  }

  return "";
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
  return getRealEmail(client.email, client.correo, client.emailReal, client.mail);
}

export function getReceiptClientEmailText(receipt = {}) {
  return getReceiptClientEmail(receipt) || "Sin correo";
}

export function getReceiptSeller(receipt = {}) {
  const user = receipt.realizadoPor || receipt.vendedor || receipt.usuario || receipt.user || {};
  return getUserDisplayName(user);
}

export function getReceiptNumber(receipt = {}) {
  return toText(receipt.reciboCodigo || receipt.number || receipt.numero || receipt.codigo, "Sin numero");
}

export function getReceiptDate(receipt = {}) {
  const value = receipt.issuedAt || receipt.fechaCreacion || receipt.fecha;
  return formatDateTime(value);
}

export function getReceiptPaymentLabel(receipt = {}) {
  const method = receipt.metodoPago || receipt.paymentMethod || receipt.venta?.metodoPago;

  if (!method) return "No registrado";
  if (typeof method === "string") return method.trim() || "No registrado";

  return method.label || method.name || method.nombre || method.id || "No registrado";
}

export function getReceiptProducts(receipt = {}) {
  return Array.isArray(receipt.productos) ? receipt.productos : Array.isArray(receipt.items) ? receipt.items : [];
}
