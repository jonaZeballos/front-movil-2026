import { apiRequest } from "../../../shared/api/client";

export async function getClientHistory(clienteId) {
  return apiRequest(`/api/clientes/${clienteId}/historial`);
}

export function getClienteName(cliente) {
  return (
    cliente?.nombre ||
    [cliente?.nombres, cliente?.apellidos].filter(Boolean).join(" ").trim() ||
    "Cliente sin nombre"
  );
}

export function getClienteId(cliente) {
  return cliente?.id || cliente?.id_cliente || cliente?.clienteId || null;
}

export function getClientePhone(cliente) {
  return cliente?.telefono || cliente?.celular || cliente?.phone || "Sin teléfono";
}

export function getClienteEmail(cliente) {
  return cliente?.correo || cliente?.email || "Sin correo";
}

export function getClienteDocument(cliente) {
  return cliente?.numeroDocumento || cliente?.documento || cliente?.ci || cliente?.nit || "No registrado";
}

export function getClienteEquipos(cliente, equipos = []) {
  const clienteId = getClienteId(cliente);

  return equipos.filter((equipo) => {
    const equipoClienteId =
      equipo?.clienteId ||
      equipo?.idCliente ||
      equipo?.id_cliente ||
      equipo?.cliente?.id ||
      equipo?.cliente?._id;

    return String(equipoClienteId) === String(clienteId);
  });
}

export function getClienteOrdenes(cliente, ordenes = [], equipos = []) {
  const clienteId = getClienteId(cliente);
  const clienteEquipos = getClienteEquipos(cliente, equipos);
  const clienteEquipoIds = clienteEquipos.map((equipo) => String(equipo.id));

  return ordenes.filter((orden) => {
    const ordenClienteId =
      orden?.clienteId ||
      orden?.idCliente ||
      orden?.id_cliente ||
      orden?.cliente?.id ||
      orden?.cliente?._id;

    const ordenEquipoId =
      orden?.equipoId ||
      orden?.idEquipo ||
      orden?.id_equipo ||
      orden?.equipo?.id ||
      orden?.equipo?._id;

    return (
      String(ordenClienteId) === String(clienteId) ||
      clienteEquipoIds.includes(String(ordenEquipoId))
    );
  });
}

export function buildClientHistory(cliente, ordenes = [], equipos = []) {
  const clienteEquipos = getClienteEquipos(cliente, equipos);
  const clienteOrdenes = getClienteOrdenes(cliente, ordenes, equipos);

  const equipoEvents = clienteEquipos.map((equipo) => ({
    id: `equipo-${equipo.id}`,
    type: "equipo",
    title: "Equipo registrado",
    description: getEquipoDescription(equipo),
    date: equipo.fechaRegistro || equipo.createdAt || equipo.fecha_creacion || null,
    status: "Registrado",
    raw: equipo,
  }));

  const ordenEvents = clienteOrdenes.map((orden) => ({
    id: `orden-${orden.id}`,
    type: "orden",
    title: "Orden de servicio",
    description: getOrdenDescription(orden),
    date: orden.fecha || orden.createdAt || orden.fecha_creacion || orden.updatedAt || null,
    status: orden.estado || orden.status || "Pendiente",
    raw: orden,
  }));

  return [...equipoEvents, ...ordenEvents].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;

    return dateB - dateA;
  });
}

export function getClientStats(cliente, ordenes = [], equipos = []) {
  const clienteEquipos = getClienteEquipos(cliente, equipos);
  const clienteOrdenes = getClienteOrdenes(cliente, ordenes, equipos);

  const pendientes = clienteOrdenes.filter((orden) => {
    const estado = String(orden.estado || orden.status || "").toLowerCase();
    return estado.includes("pendiente") || estado.includes("proceso") || estado.includes("diagnostico");
  });

  return {
    totalEquipos: clienteEquipos.length,
    totalOrdenes: clienteOrdenes.length,
    pendientes: pendientes.length,
  };
}

export function filterClientHistory(history = [], filter = "todos") {
  if (filter === "todos") return history;

  return history.filter((item) => item.type === filter);
}

export function formatHistoryDate(value) {
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

function getEquipoDescription(equipo) {
  const tipo = equipo.tipo || equipo.nombre || equipo.categoria || "Equipo";
  const marca = equipo.marca || "Sin marca";
  const modelo = equipo.modelo || "Sin modelo";

  return `${tipo} · ${marca} ${modelo}`;
}

function getOrdenDescription(orden) {
  return (
    orden.diagnostico ||
    orden.descripcion ||
    orden.observacion ||
    orden.detalle ||
    "Servicio registrado para el cliente"
  );
}
