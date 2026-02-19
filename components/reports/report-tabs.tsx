"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Link from "next/link";

type ReportType = { narrativeBody: string };
type SignalWithSources = { id: string; companyName: string; sponsor: string; sector: string; confidence: string; signalSummary: string };

export function ReportTabs({ report, signals }: { report: ReportType; signals: SignalWithSources[] }) {
  const [tab, setTab] = useState<"narrative" | "signals">("narrative");
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button className="rounded border px-3 py-1" onClick={() => setTab("narrative")}>Narrative</button>
        <button className="rounded border px-3 py-1" onClick={() => setTab("signals")}>Signals</button>
      </div>
      {tab === "narrative" ? (
        <article className="card prose prose-invert max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{report.narrativeBody}</ReactMarkdown>
        </article>
      ) : (
        <section className="space-y-3">
          <div className="flex gap-2">
            <button className="rounded border px-3 py-1" onClick={() => setView("table")}>Table</button>
            <button className="rounded border px-3 py-1" onClick={() => setView("cards")}>Cards</button>
          </div>
          {view === "table" ? (
            <div className="card overflow-x-auto">
              <table className="w-full text-left text-sm"><thead><tr><th>Company</th><th>Sponsor</th><th>Sector</th><th>Confidence</th></tr></thead>
                <tbody>{signals.map((s)=><tr key={s.id} className="border-t border-slate-800"><td><Link href={`/signals/${s.id}`}>{s.companyName}</Link></td><td>{s.sponsor}</td><td>{s.sector}</td><td>{s.confidence}</td></tr>)}</tbody></table>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">{signals.map((s)=><div key={s.id} className="card"><Link href={`/signals/${s.id}`} className="font-medium">{s.companyName}</Link><p className="text-sm">{s.signalSummary}</p></div>)}</div>
          )}
        </section>
      )}
    </div>
  );
}
