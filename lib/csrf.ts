const CSRF_COOKIE_NAME = "farvater-csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const CSRF_COOKIE_MAX_AGE = 60 * 60 * 24;

function getCrypto() {
  if (typeof globalThis.crypto !== "undefined") {
    return globalThis.crypto;
  }
  throw new Error("Web Crypto API is not available in this environment.");
}

function randomToken() {
  const crypto = getCrypto();
  if (typeof crypto.randomUUID === "function") {
    return crypto.randomUUID().replace(/-/g, "");
  }
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i += 1) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

export function generateCsrfToken() {
  return randomToken();
}

export function verifyCsrfValue(value: string | undefined | null) {
  return Boolean(value && value.length >= 32);
}

export function assertCsrf(request: Request) {
  const headerToken = request.headers.get(CSRF_HEADER_NAME);
  const cookieToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${CSRF_COOKIE_NAME}=`))
    ?.slice(CSRF_COOKIE_NAME.length + 1);

  if (!headerToken || !cookieToken) {
    throw new Error("CSRF token missing");
  }

  if (!verifyCsrfValue(headerToken) || !verifyCsrfValue(cookieToken)) {
    throw new Error("CSRF token invalid");
  }

  if (!safeEqual(headerToken, cookieToken)) {
    throw new Error("CSRF token mismatch");
  }
}

export function ensureCsrfCookie(isSecure: boolean) {
  const token = generateCsrfToken();
  return {
    name: CSRF_COOKIE_NAME,
    value: token,
    attributes: {
      httpOnly: false,
      sameSite: "lax" as const,
      secure: isSecure,
      path: "/",
      maxAge: CSRF_COOKIE_MAX_AGE,
    },
  };
}

export function getClientIp(request: Request | { headers: Headers }): string {
  const headers = request instanceof Request ? request.headers : request.headers;
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const realIp = headers.get("x-real-ip") || headers.get("cf-connecting-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

export { CSRF_COOKIE_NAME, CSRF_COOKIE_MAX_AGE, CSRF_HEADER_NAME };
