import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";

export type WorkerEnv = { Bindings: { DB: D1Database; ADMIN_PASSWORD?: string } };
const cookie = "studio_admin_session";
const lifetime = 60 * 60 * 24 * 7;
const encoder = new TextEncoder();

async function key(password: string) {
  return crypto.subtle.importKey("raw", encoder.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function verifyAdminPassword(input: string, password?: string) {
  if (!password || !input) return false;
  const message = encoder.encode("studio-admin-password-check");
  const expected = await key(password);
  const signature = await crypto.subtle.sign("HMAC", await key(input), message);
  return crypto.subtle.verify("HMAC", expected, signature, message);
}

export async function hasAdminSession(c: Context<WorkerEnv>) {
  const password = c.env.ADMIN_PASSWORD;
  const token = getCookie(c, cookie);
  const match = token?.match(/^(\d{10})\.([0-9a-f]{64})$/);
  if (!password || !match || Number(match[1]) <= Date.now() / 1000) return false;
  const signature = Uint8Array.from(match[2].match(/../g)!, (byte) => parseInt(byte, 16));
  return crypto.subtle.verify("HMAC", await key(password), signature, encoder.encode(`studio-admin-session:${match[1]}`));
}

export async function startAdminSession(c: Context<WorkerEnv>, password: string) {
  const expiry = Math.floor(Date.now() / 1000) + lifetime;
  const signature = await crypto.subtle.sign("HMAC", await key(password), encoder.encode(`studio-admin-session:${expiry}`));
  const hex = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, "0")).join("");
  setCookie(c, cookie, `${expiry}.${hex}`, {
    httpOnly: true, sameSite: "Strict", path: "/admin", maxAge: lifetime,
    secure: new URL(c.req.url).protocol === "https:",
  });
}

export function endAdminSession(c: Context<WorkerEnv>) {
  deleteCookie(c, cookie, { path: "/admin", secure: new URL(c.req.url).protocol === "https:" });
}
