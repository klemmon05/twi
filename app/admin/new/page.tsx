"use client";

import { useState } from "react";

const initialPayload = {
  report: {
    report_date: new Date().toISOString().slice(0, 10),
    title: "",
    overview_summary: "",
    narrative_body: "",
    tags: ["daily"]
  },
  signals: []
};

export default function AdminNewPage() {
  const [payload, setPayload] = useState(JSON.stringify(initialPayload, null, 2));
  const [message, setMessage] = useState("");
  async function submit() {
    const res = await fetch("/api/ingest", { method: "POST", headers: { "content-type": "application/json" }, body: payload });
    const data = await res.json();
    setMessage(res.ok ? `Saved report ${data.reportId}` : data.error);
  }
  return (
    <div className="space-y-3">
      <h1 className="text-2xl">Bulk JSON import</h1>
      <textarea className="h-[28rem] w-full rounded bg-slate-900 p-3 font-mono text-sm" value={payload} onChange={(e)=>setPayload(e.target.value)} />
      <button className="rounded bg-blue-600 px-4 py-2" onClick={submit}>Import</button>
      {message && <p>{message}</p>}
    </div>
  );
}
