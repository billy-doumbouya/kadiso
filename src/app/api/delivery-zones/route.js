import { NextResponse } from "next/server";
import { DeliveryZones } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(DeliveryZones.all());
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body?.zone || !body?.fee || !body?.delay) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  const zone = DeliveryZones.create(body);
  return NextResponse.json(zone, { status: 201 });
}
