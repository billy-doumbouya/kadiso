import { NextResponse } from "next/server";
import { Quotes } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await Quotes.all());
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.companyName || !body?.email || !body?.phone || !body?.products || !body?.quantity) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const quote = await Quotes.create(body);
  return NextResponse.json(quote, { status: 201 });
}