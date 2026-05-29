import { apiRequest } from "../../../shared/api/client";

export async function listUsers() {
  const users = await apiRequest("/api/usuarios");
  return users.map(mapUser);
}

export async function createUser(userData) {
  const role = userData.role === "ventas" ? "ventas" : "tecnico";
  const endpoint = role === "ventas" ? "/api/usuarios/registro-ventas" : "/api/usuarios/registro-tecnico";
  const name = userData.name || [userData.nombres, userData.apellidos].filter(Boolean).join(" ").trim();

  const user = await apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify({
      name,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      username: userData.username,
      email: userData.email,
      password: userData.password,
      numero: userData.numero || userData.phone || "0",
    }),
  });

  return mapUser({ ...user, role });
}

function mapUser(user) {
  const name = user.name || [user.nombres, user.apellidos].filter(Boolean).join(" ").trim();

  return {
    id: user.id,
    name,
    email: user.email,
    role: user.role || user.rol,
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
