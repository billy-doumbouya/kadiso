import { NextResponse } from "next/server";
import { AdminUsers } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { createSessionToken, getSessionSecret, SESSION_COOKIE_NAME } from "@/lib/session";

const SESSION_MAX_AGE = 8 * 60 * 60; // 8h

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password;

  if (!email || !password) {
    return NextResponse.json({ error: "Email et mot de passe requis" }, { status: 400 });
  }

  const user = await AdminUsers.byEmail(email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 });
  }

  const token = await createSessionToken(
    { email: user.email, name: user.name },
    getSessionSecret(),
    SESSION_MAX_AGE
  );

  const response = NextResponse.json({ email: user.email, name: user.name });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return response;
}