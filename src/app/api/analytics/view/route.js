import { NextResponse } from "next/server";
import { PageViews } from "@/lib/db";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const path = typeof body?.path === "string" ? body.path.slice(0, 200) : "/";
  await PageViews.record(path);
  return NextResponse.json({ ok: true });
}