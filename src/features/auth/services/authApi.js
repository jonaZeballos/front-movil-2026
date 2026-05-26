import { apiRequest, setAuthToken } from "../../../shared/api/client";

export async function login(credentials) {
  const data = await apiRequest("/api/usuarios/login", {
    method: "POST",
    body: JSON.stringify({
      usuario: credentials.email || credentials.username,
      password: credentials.password,
    }),
  });

  setAuthToken(data.token);
  return data;
}

export async function registerBusinessOwner(data) {
  return apiRequest("/api/usuarios/registro", {
    method: "POST",
    body: JSON.stringify({
      nombres: data.nombres || data.names,
      apellidos: data.apellidos || "-",
      username: data.username,
      email: data.email,
      password: data.password,
      numero: data.numero || data.telefono || "0",
      negocioNombre: data.negocioNombre,
      rol: "admin",
    }),
  });
}

export function logout() {
  setAuthToken(null);
}
