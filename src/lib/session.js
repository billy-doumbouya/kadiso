// Vanilla, dependency-free session tokens: HMAC-SHA256 over base64url JSON,
// built only on Web Crypto so it runs identically in middleware (Edge) and
// in route handlers (Node.js) without any extra package.

function bytesToBase64url(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64urlToBytes(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function encodeJSON(obj) {
  return bytesToBase64url(new TextEncoder().encode(JSON.stringify(obj)));
}

function decodeJSON(b64url) {
  return JSON.parse(new TextDecoder().decode(base64urlToBytes(b64url)));
}

async function importKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function createSessionToken(payload, secret, maxAgeSeconds = 8 * 60 * 60) {
  const body = encodeJSON({ ...payload, exp: Date.now() + maxAgeSeconds * 1000 });
  const key = await importKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body));
  return `${body}.${bytesToBase64url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token, secret) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  try {
    const key = await importKey(secret);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      base64urlToBytes(signature),
      new TextEncoder().encode(body)
    );
    if (!valid) return null;

    const data = decodeJSON(body);
    if (!data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = "kadiso_admin_session";

export function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret) return secret;
  // Dev-only fallback so the app still runs without extra setup; sessions
  // simply won't survive a server restart. Never rely on this in production.
  return "kadiso-dev-secret-do-not-use-in-production";
}
