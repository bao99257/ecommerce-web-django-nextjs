"use client";

export function logout() {
  document.cookie = "access=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
  document.cookie = "refresh=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
}
