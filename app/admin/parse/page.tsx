"use client";

import { useMemo, useState } from "react";

type DraftSignal = {
  company_name: string;
  sponsor: string;
  sector: string;
  signal_type: "Structural Trigger" | "Quiet Signal";
  confidence: "High" | "Medium" | "Low";
  signal_summary: string;
  evidence_bullets: string[];
};

export default function ParsePage() {
  const [raw, setRaw] = useState("");
  const [jsonInput, setJsonInput] = useState("[]");
  const [drafts, setDrafts] = useState<DraftSignal[]>([]);

  const hints = useMemo(() => raw.split("\n").filter(Boolean).slice(0, 3), [raw]);

  function parseJson() {
    const parsed = JSON.parse(jsonInput) as DraftSignal[];
    setDrafts(parsed);
  }

  async function approveAndSave() {
    const payload = { report: { report_date: new Date().toISOString().slice(0, 10), title: `Daily Private Equity Transformation Trigger Report — ${new Date().toISOString().slice(0,10)}`, overview_summary: "Parsed from narrative", narrative_body: raw, tags: ["parsed"] }, signals: drafts.map((d) => ({ ...d, geography: "", sources: [], people_mentioned: [], keywords: [] })) };
    await fetch("/api/ingest", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    alert("Saved drafts");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Parse Narrative to Signals</h1>
      <textarea value={raw} onChange={(e)=>setRaw(e.target.value)} placeholder="Paste narrative text" className="h-40 w-full rounded bg-slate-900 p-3" />
      <div className="card"><p className="text-sm text-slate-400">Best-effort extraction hints</p><ul className="list-disc pl-5">{hints.map((h)=><li key={h}>{h}</li>)}</ul></div>
      <textarea value={jsonInput} onChange={(e)=>setJsonInput(e.target.value)} className="h-48 w-full rounded bg-slate-900 p-3 font-mono text-sm" />
      <button className="rounded border px-3 py-2" onClick={parseJson}>Preview JSON</button>
      <div className="space-y-2">{drafts.map((d, i)=><div key={i} className="card"><input className="w-full bg-transparent" value={d.company_name} onChange={(e)=>setDrafts(drafts.map((x,idx)=>idx===i?{...x,company_name:e.target.value}:x))} /><textarea className="w-full bg-transparent" value={d.signal_summary} onChange={(e)=>setDrafts(drafts.map((x,idx)=>idx===i?{...x,signal_summary:e.target.value}:x))} /><button className="text-red-400" onClick={()=>setDrafts(drafts.filter((_,idx)=>idx!==i))}>Delete</button></div>)}</div>
      <button onClick={approveAndSave} className="rounded bg-blue-600 px-4 py-2">Approve & save</button>
    </div>
  );
}
