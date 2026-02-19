import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const totalSignals = await prisma.signal.count();
  const totalReports = await prisma.report.count();
  return NextResponse.json({ totalSignals, totalReports });
}
