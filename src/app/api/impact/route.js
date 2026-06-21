import { NextResponse } from "next/server";
import { Impact } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await Impact.current());
}

export async function PATCH(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  const totalAmount = Number(body?.totalAmount);
  if (!Number.isFinite(totalAmount) || totalAmount < 0) {
    return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
  }
  const impact = await Impact.set(totalAmount, body?.note);
  return NextResponse.json(impact);
}