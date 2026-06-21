import { NextResponse } from "next/server";
import { Orders } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return NextResponse.json(await Orders.all());
}

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!body?.fullName || !body?.phone || !body?.email || !body?.address || !body?.zone || !body?.paymentMethod) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  if (!Array.isArray(body.items) || body.items.length === 0) {
    return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
  }
  const orderNumber = `KS-${Math.floor(100000 + Math.random() * 900000)}`;
  const order = await Orders.create({ ...body, orderNumber });
  return NextResponse.json(order, { status: 201 });
}