import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";
import { TrendsDashboard } from "@/components/charts/trends-dashboard";

export default async function TrendsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const from = new Date(params.from ?? subDays(new Date(), 30).toISOString());
  const to = new Date(params.to ?? new Date().toISOString());
  const where = { report: { reportDate: { gte: from, lte: to } }, sponsor: params.sponsor || undefined, sector: params.sector || undefined };

  const signals = await prisma.signal.findMany({ where, include: { report: true } });
  const rollup = <T extends string>(arr: T[]) => Object.entries(arr.reduce((acc, x) => ((acc[x] = (acc[x] ?? 0) + 1), acc), {} as Record<string, number>)).map(([name, count]) => ({ name, count }));
  const data = {
    timeSeries: Object.values(signals.reduce((acc, s) => {
      const date = s.report.reportDate.toISOString().slice(0, 10);
      acc[date] = { date, count: (acc[date]?.count ?? 0) + 1 };
      return acc;
    }, {} as Record<string, { date: string; count: number }>)) as { date: string; count: number }[],
    sponsors: rollup(signals.map((s) => s.sponsor)).slice(0, 8),
    sectors: rollup(signals.map((s) => s.sector)),
    confidence: rollup(signals.map((s) => s.confidence))
  };

  return <div className="space-y-4"><h1 className="text-2xl font-semibold">Trends & Analytics</h1><TrendsDashboard data={data} /></div>;
}
