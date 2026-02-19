import { NextResponse } from "next/server";
import { adminCookieName } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();
  if (!process.env.ADMIN_SECRET || body.password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(adminCookieName, process.env.ADMIN_SECRET, { httpOnly: true, sameSite: "lax", secure: true, path: "/" });
  return res;
}
