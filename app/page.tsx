import Link from "next/link";
import { getFacetOptions, getLatestReport } from "@/lib/data";

export default async function HomePage() {
  try {
    const [latest, facets] = await Promise.all([getLatestReport(), getFacetOptions()]);
    if (!latest) return <p>No reports yet.</p>;

    const highConfidence = latest.signals.filter((s: { confidence: string }) => s.confidence === "HIGH").length;
    const topSponsors = [...new Set(latest.signals.map((s: { sponsor: string }) => s.sponsor))].slice(0, 3);

    return (
      <div className="space-y-6">
        <section className="card space-y-3">
          <h1 className="text-3xl font-bold">Daily Transformation Trigger Intelligence</h1>
          <p className="text-slate-300">External-facing repository for structured and narrative private equity signals.</p>
          <Link href="/reports" className="inline-block rounded bg-blue-600 px-4 py-2">Browse reports</Link>
        </section>
        <section className="grid gap-4 md:grid-cols-3">
          <div className="card"><p className="text-sm text-slate-400">Signals Today</p><p className="text-3xl">{latest.signals.length}</p></div>
          <div className="card"><p className="text-sm text-slate-400">High Confidence</p><p className="text-3xl">{highConfidence}</p></div>
          <div className="card"><p className="text-sm text-slate-400">Top Sponsors</p><p>{topSponsors.join(", ") || "-"}</p></div>
        </section>
        <section className="card space-y-2">
          <h2 className="text-xl font-semibold">Latest Report</h2>
          <p>{latest.title}</p>
          <p className="text-slate-300">{latest.overviewSummary}</p>
          <div className="flex flex-wrap gap-2">{latest.tags.map((tag)=><span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs">{tag}</span>)}</div>
          <Link href={`/reports/${latest.id}`} className="text-blue-300">Open report</Link>
        </section>
        <section className="card">
          <p className="text-sm text-slate-400">Available facets</p>
          <p className="text-sm">Sponsors: {facets.sponsors.slice(0, 5).join(", ")}</p>
        </section>
      </div>
    );
  } catch {
    return (
      <section className="card space-y-2">
        <h1 className="text-2xl font-semibold">ProSignal Analytics</h1>
        <p className="text-slate-300">The application is online, but the database is not reachable yet.</p>
        <p className="text-sm text-slate-400">Check your DATABASE_URL in Vercel and run prisma migrate deploy, then refresh.</p>
      </section>
    );
  }
}
