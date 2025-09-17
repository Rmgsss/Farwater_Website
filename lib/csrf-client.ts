"use client";

const CSRF_COOKIE_NAME = "farvater-csrf";

export function getCsrfToken() {
  if (typeof document === "undefined") {
    return "";
  }
  const match = document.cookie
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CSRF_COOKIE_NAME}=`));
  if (!match) {
    return "";
  }
  return decodeURIComponent(match.substring(CSRF_COOKIE_NAME.length + 1));
}
