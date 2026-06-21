import { NextResponse } from "next/server";
import { DeliveryZones } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });

  const zone = DeliveryZones.update(Number(id), body);
  return NextResponse.json(zone);
}

export async function DELETE(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  DeliveryZones.remove(Number(id));
  return NextResponse.json({ ok: true });
}
