import { NextResponse } from "next/server";
import { Products } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const category = request.nextUrl.searchParams.get("categorie");
  const list = category ? await Products.byCategory(category) : await Products.all();
  return NextResponse.json(list);
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.name || !body?.category) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  try {
    const product = await Products.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}s