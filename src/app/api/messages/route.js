import { NextResponse } from "next/server";
import { Messages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(Messages.all());
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.name || !body?.email || !body?.subject || !body?.message) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const message = Messages.create(body);
  return NextResponse.json(message, { status: 201 });
}
