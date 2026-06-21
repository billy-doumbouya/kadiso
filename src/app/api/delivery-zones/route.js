import { NextResponse } from "next/server";
import { DeliveryZones } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const zones = await DeliveryZones.all(); 
  return NextResponse.json(zones);
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  if (!body?.zone || !body?.fee || !body?.delay) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  return NextResponse.json(zone, { status: 201 });
}