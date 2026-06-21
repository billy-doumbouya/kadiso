import { NextResponse } from "next/server";
import { Newsletter } from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: "Email requis" }, { status: 400 });
  }
  Newsletter.create(body.email.trim().toLowerCase());
  return NextResponse.json({ ok: true }, { status: 201 });
}
