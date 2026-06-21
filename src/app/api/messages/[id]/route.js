import { NextResponse } from "next/server";
import { Messages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const VALID_STATUSES = ["nouveau", "traite"];

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body?.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }
  const message = await Messages.updateStatus(Number(id), body.status);
  return NextResponse.json(message);
}