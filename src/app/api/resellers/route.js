import { NextResponse } from "next/server";
import { Resellers } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await Resellers.all());
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.companyName || !body?.contactName || !body?.email || !body?.phone || !body?.rccm || !body?.ifu) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const reseller = await Resellers.create(body);
  return NextResponse.json(reseller, { status: 201 });
}