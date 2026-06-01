import { apiRequest } from "../../../shared/api/client";

export function listClientes(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/clientes${query}`).then((clientes) => clientes.map(mapCliente));
}

export function createCliente(clienteData) {
  return apiRequest("/api/clientes", {
    method: "POST",
    body: JSON.stringify({
      nombres: clienteData.nombres,
      apellidos: clienteData.apellidos,
      razonSocial: clienteData.razonSocial || clienteData.nombre,
      numeroDocumento: clienteData.numeroDocumento,
      numero: clienteData.numero || clienteData.telefono,
      email: clienteData.email || clienteData.correo,
      direccion: clienteData.direccion,
    }),
  }).then(mapCliente);
}

export function addClienteToBlacklist(clienteId, motivo) {
  return apiRequest(`/api/clientes/${clienteId}/lista-negra`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
  }).then(mapCliente);
}

export function removeClienteFromBlacklist(clienteId) {
  return apiRequest(`/api/clientes/${clienteId}/quitar-lista-negra`, {
    method: "PATCH",
  }).then(mapCliente);
}

function mapCliente(cliente) {
  return {
    ...cliente,
    nombre: cliente.nombre || cliente.razonSocial,
    correo: cliente.correo || cliente.email || "",
    telefono: cliente.telefono || "",
    direccion: cliente.direccion || "",
    iniciales: getInitials(cliente.nombre || cliente.razonSocial || ""),
  };
}

function getInitials(nombre) {
  return nombre
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}
