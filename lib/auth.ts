import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE } from "./constants";

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set in environment");
  }
  return secret;
}

const encoder = new TextEncoder();

let cachedHash: string | null = null;
let computingHash: Promise<string> | null = null;

async function getSecretHash(): Promise<string> {
  if (cachedHash) {
    return cachedHash;
  }

  if (!computingHash) {
    computingHash = (async () => {
      const secret = getAdminSecret();
      if (!globalThis.crypto?.subtle) {
        throw new Error("Web Crypto API is not available to hash ADMIN_SECRET");
      }

      const data = encoder.encode(secret);
      const digest = await globalThis.crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(digest));
      cachedHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      return cachedHash;
    })();
  }

  try {
    return await computingHash;
  } finally {
    computingHash = null;
  }
}

export async function createSessionToken(): Promise<string> {
  return getSecretHash();
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }
  try {
    const secretHash = await getSecretHash();
    return token === secretHash;
  } catch (error) {
    console.error("Failed to verify admin session", error);
    return false;
  }
}

export async function setAdminSession(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminSession(): void {
  const cookieStore = cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

export async function assertAdminSessionOrRedirect(): Promise<void> {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!(await verifySessionToken(token))) {
    redirect("/admin/login");
  }
}
