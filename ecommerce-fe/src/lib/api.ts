import { redirect } from "next/navigation";

const BASE_URL = "http://localhost:8000/api"
export const BACKEND_URL = "http://localhost:8000";


export async function api(path: string, options: any = {}, retry = true) {
  const headers: any = {
    ...(!(options.body instanceof FormData) && { "Content-Type": "application/json" }),
    ...(options.headers || {})
  };

  // Add Authorization header only if it's not a GET request or explicitly requested
  if ((options.method && options.method !== "GET") || options.authenticated) {
    Object.assign(headers, authHeaders());
  }

  // Thêm CSRF token cho POST/PUT/PATCH/DELETE
  if (["POST", "PUT", "PATCH", "DELETE"].includes(options.method || "GET")) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      headers["X-CSRFToken"] = csrfToken;
    }
  }

  const res = await fetch(`http://localhost:8000/api${path}`, {
    credentials: "include",
    ...options,
    headers
  });
  if (res.status === 204 || res.status === 205) {
    return null;
  }
  if (!res.ok) {
    if (res.status === 401 && retry) {
      const newAccessToken = await refreshToken();
      if (newAccessToken) {
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        return api(path, newOptions, false);
      }
    }
    const error: any = new Error("API Error");
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// Hàm lấy CSRF token từ cookie
function getCsrfToken() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
}




export function getAccessToken() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/access=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
}

export function setAccess(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `access=${token}; path=/;`;
  }
}

export function setRefresh(token: string) {
  if (typeof document !== "undefined") {
    document.cookie = `refresh=${token}; path=/;`;
  }
}

export function getRefreshToken() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/refresh=([^;]+)/);
    return match ? match[1] : null;
  }
  return null;
}

export async function refreshToken() {
  const refresh = getRefreshToken();
  if (!refresh) {
    return null;
  }

  const res = await fetch(`${BACKEND_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!res.ok) {
    return null;
  }

  const data = await res.json();
  setAccess(data.access);
  return data.access;
}

export function authHeaders() {
  const access = getAccessToken();
  return access ? { Authorization: `Bearer ${access}` } : {};
}

