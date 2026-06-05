import { apiRequest } from "../../../shared/api/client";

export async function listUsers() {
  const users = await apiRequest("/api/usuarios");
  return users.map(mapUser);
}

export async function createUser(userData) {
  const role = userData.role === "ventas" ? "ventas" : "tecnico";
  const endpoint = role === "ventas" ? "/api/usuarios/registro-ventas" : "/api/usuarios/registro-tecnico";
  const name = userData.name || [userData.nombres, userData.apellidos].filter(Boolean).join(" ").trim();
  const phone = userData.numero || userData.telefono || userData.phone;
  const payload = {
    name,
    nombres: userData.nombres,
    apellidos: userData.apellidos,
    username: userData.username,
    email: userData.email,
    password: userData.password,
  };

  if (phone) {
    payload.numero = phone;
  }

  const user = await apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return mapUser({ ...user, role });
}

export async function blockUser(userId, motivo) {
  return apiRequest(`/api/usuarios/${userId}/bloquear`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
  }).then(mapUser);
}

export async function unblockUser(userId) {
  return apiRequest(`/api/usuarios/${userId}/desbloquear`, {
    method: "PATCH",
  }).then(mapUser);
}

function mapUser(user) {
  const name = user.name || [user.nombres, user.apellidos].filter(Boolean).join(" ").trim();

  return {
    id: user.id,
    name,
    email: user.email,
    role: user.role || user.rol,
    bloqueado: Boolean(user.bloqueado),
    motivoBloqueo: user.motivoBloqueo || null,
    fechaBloqueo: user.fechaBloqueo || null,
    initials: getInitials(name || user.email || "U"),
  };
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}
