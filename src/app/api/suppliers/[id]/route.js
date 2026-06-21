import { NextResponse } from "next/server";
import { Suppliers } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["en_attente", "validee", "refusee"];

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }
  const supplier = await Suppliers.updateStatus(Number(id), body.status);
  return NextResponse.json(supplier);
}