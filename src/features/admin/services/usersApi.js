import { apiRequest } from "../../../shared/api/client";

export async function createUser(userData) {
  const role = userData.role === "ventas" ? "ventas" : "tecnico";
  const endpoint = role === "ventas" ? "/api/usuarios/registro-ventas" : "/api/usuarios/registro-tecnico";

  return apiRequest(endpoint, {
    method: "POST",
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      numero: userData.numero || userData.phone || "0",
    }),
  });
}
