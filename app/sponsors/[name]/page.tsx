import { prisma } from "@/lib/prisma";

export default async function SponsorPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const sponsor = decodeURIComponent(name);
  const signals = await prisma.signal.findMany({ where: { sponsor: { equals: sponsor, mode: "insensitive" } } });
  const companies = [...new Set(signals.map((s) => s.companyName))].slice(0, 10);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Sponsor: {sponsor.toUpperCase()}</h1>
      <div className="card">Signals tracked: {signals.length}</div>
      <div className="card">Most mentioned companies: {companies.join(", ") || "-"}</div>
      <div className="card">Confidence mix: HIGH {signals.filter((s)=>s.confidence==="HIGH").length} · MEDIUM {signals.filter((s)=>s.confidence==="MEDIUM").length} · LOW {signals.filter((s)=>s.confidence==="LOW").length}</div>
    </div>
  );
}
