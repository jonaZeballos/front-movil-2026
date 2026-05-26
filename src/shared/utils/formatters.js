export function getClientName(cliente) {
  const fullName = [cliente?.nombres, cliente?.apellidos]
    .filter(Boolean)
    .join(" ")
    .trim();

  return (
    fullName ||
    cliente?.nombre ||
    cliente?.razonSocial ||
    cliente?.name ||
    "Cliente no registrado"
  );
}

export function getClientPhone(cliente) {
  return (
    cliente?.telefono ||
    cliente?.celular ||
    cliente?.phone ||
    cliente?.whatsapp ||
    ""
  );
}

export function getOrderCode(order) {
  return (
    order?.codigo ||
    order?.numero ||
    order?.number ||
    order?.id ||
    "Sin codigo"
  );
}

export function getEquipmentName(equipment) {
  return (
    equipment?.nombre ||
    equipment?.name ||
    equipment?.modelo ||
    equipment?.tipo ||
    "Equipo no registrado"
  );
}

export function cleanText(value, fallback = "No registrado") {
  const text = String(value || "").trim();
  return text || fallback;
}