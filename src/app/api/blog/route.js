import { NextResponse } from "next/server";
import { BlogPosts } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  return NextResponse.json(await BlogPosts.all());
}

export async function POST(request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.title || !body?.category || !body?.date) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }
  try {
    const post = await BlogPosts.create(body);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}