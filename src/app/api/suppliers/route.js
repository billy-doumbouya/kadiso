import { NextResponse } from "next/server";
import { Suppliers } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(Suppliers.all());
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName || !body?.phone || !body?.email || !body?.region || !body?.crop) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const supplier = Suppliers.create(body);
  return NextResponse.json(supplier, { status: 201 });
}
