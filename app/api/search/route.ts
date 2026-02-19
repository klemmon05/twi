import { NextResponse } from "next/server";
import { searchSignals } from "@/lib/data";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const data = await searchSignals(Object.fromEntries(searchParams.entries()));
  return NextResponse.json(data);
}
