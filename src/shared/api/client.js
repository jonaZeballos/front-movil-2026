const DEFAULT_API_URL = "http://localhost:3000";

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function getApiBaseUrl() {
  return process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...options,
    headers,
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.error || payload.mensaje || "Error de comunicacion con el servidor");
  }

  return payload.data ?? payload;
}
