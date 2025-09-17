import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import { ADMIN_SESSION_COOKIE } from "./constants";

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not set in environment");
  }
  return secret;
}

function getSecretHash(): string {
  const secret = getAdminSecret();
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export function createSessionToken(): string {
  return getSecretHash();
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) {
    return false;
  }
  try {
    return token === getSecretHash();
  } catch (error) {
    console.error("Failed to verify admin session", error);
    return false;
  }
}

export function setAdminSession(): void {
  const cookieStore = cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
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

export function assertAdminSessionOrRedirect(): void {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }
}
