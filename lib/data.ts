import { subDays } from "date-fns";
import { prisma } from "@/lib/prisma";

export type SignalFilters = {
  q?: string;
  sponsor?: string;
  sector?: string;
  signalType?: string;
  confidence?: string;
  geography?: string;
  from?: string;
  to?: string;
  page?: number;
  pageSize?: number;
};

export async function getLatestReport() {
  return prisma.report.findFirst({
    orderBy: { reportDate: "desc" },
    include: { signals: true }
  });
}

export async function getReports() {
  return prisma.report.findMany({ orderBy: { reportDate: "desc" }, include: { signals: true } });
}

export async function getReport(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { signals: { include: { sources: true }, orderBy: { createdAt: "desc" } } }
  });
}

export async function searchSignals(filters: SignalFilters) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 20;
  const from = filters.from ? new Date(filters.from) : subDays(new Date(), 30);
  const to = filters.to ? new Date(filters.to) : new Date();

  const where: Record<string, unknown> = {
    report: { reportDate: { gte: from, lte: to } },
    sponsor: filters.sponsor || undefined,
    sector: filters.sector || undefined,
    signalType: filters.signalType,
    confidence: filters.confidence,
    geography: filters.geography || undefined,
    ...(filters.q
      ? {
          OR: [
            { companyName: { contains: filters.q, mode: "insensitive" } },
            { sponsor: { contains: filters.q, mode: "insensitive" } },
            { sector: { contains: filters.q, mode: "insensitive" } },
            { signalSummary: { contains: filters.q, mode: "insensitive" } },
            { evidenceBullets: { hasSome: [filters.q] } },
            { keywords: { hasSome: [filters.q] } },
            { peopleMentioned: { hasSome: [filters.q] } },
            { report: { narrativeBody: { contains: filters.q, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const [items, total] = await Promise.all([
    prisma.signal.findMany({
      where,
      include: { report: true, sources: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ report: { reportDate: "desc" } }, { confidence: "asc" }]
    }),
    prisma.signal.count({ where })
  ]);

  return { items, total, page, pageSize };
}

export async function getFacetOptions() {
  const [sponsors, sectors, geographies] = await Promise.all([
    prisma.signal.findMany({ distinct: ["sponsor"], select: { sponsor: true }, orderBy: { sponsor: "asc" } }),
    prisma.signal.findMany({ distinct: ["sector"], select: { sector: true }, orderBy: { sector: "asc" } }),
    prisma.signal.findMany({ distinct: ["geography"], select: { geography: true }, where: { geography: { not: null } } })
  ]);
  return {
    sponsors: sponsors.map((s) => s.sponsor),
    sectors: sectors.map((s) => s.sector),
    geographies: geographies.map((g) => g.geography as string)
  };
}
