
import { getCloudflareContext } from "@opennextjs/cloudflare";

const COOKIE_NAME = "admin_session";
const SESSION_DURATION = 8 * 60 * 60; // 8 hours

function base64UrlEncode(bytes) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(value) {
  const base64 = value
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const padded = base64.padEnd(
    Math.ceil(base64.length / 4) * 4,
    "="
  );

  const binary = atob(padded);

  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function sign(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );

  return new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(value)
    )
  );
}

export async function createSessionToken(email, secret) {
  const payload = {
    sub: email,
    exp: Math.floor(Date.now() / 1000) + SESSION_DURATION,
  };

  const encodedPayload = base64UrlEncode(
    new TextEncoder().encode(JSON.stringify(payload))
  );

  const signature = await sign(encodedPayload, secret);

  return `${encodedPayload}.${base64UrlEncode(signature)}`;
}

export async function verifySessionToken(token, secret) {
  try {
    const parts = token.split(".");

    if (parts.length !== 2) return null;

    const [payloadPart, signaturePart] = parts;
    const signature = base64UrlDecode(signaturePart);

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      new TextEncoder().encode(payloadPart)
    );

    if (!valid) return null;

    const payload = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payloadPart))
    );

    if (
      typeof payload.sub !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function getSessionCookie(request, token) {
  const secure = new URL(request.url).protocol === "https:";

  return [
    `${COOKIE_NAME}=${token}`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    `Max-Age=${SESSION_DURATION}`,
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export function clearSessionCookie(request) {
  const secure = new URL(request.url).protocol === "https:";

  return [
    `${COOKIE_NAME}=`,
    "HttpOnly",
    "SameSite=Lax",
    "Path=/",
    "Max-Age=0",
    ...(secure ? ["Secure"] : []),
  ].join("; ");
}

export async function getAdminSession(request) {
  const env = await getAuthEnvironment();

  if (!env.SESSION_SECRET || !env.ADMIN_EMAIL) {
    return null;
  }

  const cookies = request.headers.get("cookie") || "";
  const cookie = cookies
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${COOKIE_NAME}=`));

  if (!cookie) return null;

  const token = cookie.slice(COOKIE_NAME.length + 1);
  const session = await verifySessionToken(token, env.SESSION_SECRET);

  if (
    !session ||
    session.sub !== env.ADMIN_EMAIL.trim().toLowerCase()
  ) {
    return null;
  }

  return session;
}

export async function getAuthEnvironment() {
  const { env } = await getCloudflareContext({ async: true });

  return {
    ADMIN_EMAIL: env.ADMIN_EMAIL || process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD,
    SESSION_SECRET: env.SESSION_SECRET || process.env.SESSION_SECRET,
  };
}
