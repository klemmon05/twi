import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ingestSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const input = ingestSchema.parse(await req.json());

    const report = await prisma.report.upsert({
      where: { reportDate: new Date(input.report.report_date) },
      update: {
        title: input.report.title,
        overviewSummary: input.report.overview_summary,
        narrativeBody: input.report.narrative_body,
        tags: input.report.tags
      },
      create: {
        reportDate: new Date(input.report.report_date),
        title: input.report.title,
        overviewSummary: input.report.overview_summary,
        narrativeBody: input.report.narrative_body,
        tags: input.report.tags
      }
    });

    await prisma.signal.deleteMany({ where: { reportId: report.id } });
    for (const signal of input.signals) {
      await prisma.signal.create({
        data: {
          reportId: report.id,
          companyName: signal.company_name,
          sponsor: signal.sponsor,
          sector: signal.sector,
          geography: signal.geography,
          signalType: signal.signal_type === "Structural Trigger" ? "STRUCTURAL_TRIGGER" : "QUIET_SIGNAL",
          confidence: signal.confidence.toUpperCase() as "HIGH" | "MEDIUM" | "LOW",
          signalSummary: signal.signal_summary,
          evidenceBullets: signal.evidence_bullets,
          peopleMentioned: signal.people_mentioned,
          keywords: signal.keywords,
          sources: {
            create: signal.sources.map((src) => ({
              title: src.title,
              publisher: src.publisher,
              url: src.url,
              date: new Date(src.date),
              quote: src.quote
            }))
          }
        }
      });
    }

    return NextResponse.json({ ok: true, reportId: report.id });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Failed ingestion" }, { status: 400 });
  }
}
