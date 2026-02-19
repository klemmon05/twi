import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function SignalDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const signal = await prisma.signal.findUnique({ where: { id }, include: { sources: true, report: true } });
  if (!signal) notFound();

  return (
    <div className="space-y-4 card">
      <h1 className="text-2xl font-semibold">{signal.companyName}</h1>
      <p>{signal.sponsor} · {signal.sector} · {signal.signalType} · {signal.confidence}</p>
      <p>{signal.signalSummary}</p>
      <ul className="list-disc pl-5">{signal.evidenceBullets.map((e)=><li key={e}>{e}</li>)}</ul>
      <h2 className="font-semibold">Sources</h2>
      <ul className="space-y-2">{signal.sources.map((src)=><li key={src.id}><a href={src.url} className="text-blue-300" target="_blank">{src.title}</a> · {src.publisher}</li>)}</ul>
    </div>
  );
}
