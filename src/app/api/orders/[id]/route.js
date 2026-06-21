import { NextResponse } from "next/server";
import { Orders } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["en_attente", "payee", "expediee", "livree", "annulee"];

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  const order = Orders.updateStatus(Number(id), body.status);
  return NextResponse.json(order);
}
