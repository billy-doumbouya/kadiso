import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, getSessionSecret, verifySessionToken } from "@/lib/session";

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token, getSessionSecret());
}

/**
 * Use at the top of any Route Handler that mutates data. Returns a Response
 * to send back immediately when the caller isn't authenticated, or null
 * when the request may proceed.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  return null;
}
