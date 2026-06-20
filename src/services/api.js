import { API_BASE } from "../config.js";

function getToken() {
  try {
    return localStorage.getItem("adminToken");
  } catch {
    return null;
  }
}

/**
 * Authenticated API call. Attaches Bearer token from localStorage.
 * On 401, clears the token and redirects to login.
 * Throws on non-2xx responses (except 204).
 * @param {string} path - API path (e.g. "/api/admin/appointments")
 * @param {RequestInit} [options] - Fetch options (method, body, etc.)
 * @returns {Promise<object|null>} Parsed JSON response, or null for 204
 */
export async function api(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    try {
      localStorage.removeItem("adminToken");
    } catch {}
    window.location.href = "login.html";
    return;
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro inesperado" }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

/**
 * Public (unauthenticated) API call. Does not attach any auth header.
 * Throws on non-2xx responses (except 204).
 * @param {string} path - API path (e.g. "/api/availability")
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<object|null>} Parsed JSON response, or null for 204
 */
export async function publicApi(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: "Erro inesperado" }));
    throw new Error(error.error || `Erro ${response.status}`);
  }

  if (response.status === 204) return null;
  return response.json();
}
