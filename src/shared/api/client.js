const DEFAULT_API_URL = "http://localhost:3000";

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function getApiBaseUrl() {
  return (process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/$/, "");
}

export async function apiRequest(path, options = {}) {
  const url = `${getApiBaseUrl()}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  let response;

  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    throw new Error(`No se pudo conectar con el servidor: ${url}`);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || payload.mensaje || "Error de comunicacion con el servidor");
  }

  return payload.data ?? payload;
}
