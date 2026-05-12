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

export function logout() {
  setAuthToken(null);
}
