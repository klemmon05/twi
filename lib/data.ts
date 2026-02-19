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

const SIGNAL_TYPES = ["STRUCTURAL_TRIGGER", "QUIET_SIGNAL"] as const;
const CONFIDENCE_LEVELS = ["HIGH", "MEDIUM", "LOW"] as const;

function parsePositiveInt(value: number | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback;
  const normalized = Math.floor(Number(value));
  return normalized > 0 ? normalized : fallback;
}

function parseDate(value?: string) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

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
  const page = parsePositiveInt(filters.page, 1);
  const pageSize = parsePositiveInt(filters.pageSize, 20);
  const from = parseDate(filters.from) ?? subDays(new Date(), 30);
  const to = parseDate(filters.to) ?? new Date();
  const signalType = SIGNAL_TYPES.includes(filters.signalType as (typeof SIGNAL_TYPES)[number])
    ? filters.signalType
    : undefined;
  const confidence = CONFIDENCE_LEVELS.includes(filters.confidence as (typeof CONFIDENCE_LEVELS)[number])
    ? filters.confidence
    : undefined;

  const where: Record<string, unknown> = {
    report: { reportDate: { gte: from, lte: to } },
    sponsor: filters.sponsor || undefined,
    sector: filters.sector || undefined,
    signalType,
    confidence,
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
