import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "studio_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function sha256(value: string) {
  return createHash("sha256").update(value, "utf8").digest();
}

/** 会话令牌由管理员密码派生，不直接把密码存进 cookie */
function sessionToken(password: string) {
  return sha256(`studio-admin:${password}`).toString("hex");
}

export function isAdminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function verifyAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return false;
  }
  return timingSafeEqual(sha256(input), sha256(expected));
}

export async function hasAdminSession() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return false;
  }
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return token === sessionToken(password);
}

export async function startAdminSession() {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionToken(password), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export async function endAdminSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
