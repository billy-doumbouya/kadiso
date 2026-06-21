import { NextResponse } from "next/server";
import { Products } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  try {
    const product = await Products.update(Number(id), body);
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await Products.remove(Number(id));
  return NextResponse.json({ ok: true });
}