"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function FilterBar({ sponsors, sectors, geographies }: { sponsors: string[]; sectors: string[]; geographies: string[] }) {
  const router = useRouter();
  const params = useSearchParams();

  function update(name: string, value: string) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(name);
    else next.set(name, value);
    router.push(`/reports?${next.toString()}`);
  }

  return (
    <div className="card grid gap-3 md:grid-cols-6">
      <input defaultValue={params.get("q") ?? ""} onBlur={(e) => update("q", e.target.value)} placeholder="Search signals..." className="rounded bg-slate-900 p-2" />
      <select defaultValue={params.get("sponsor") ?? ""} onChange={(e) => update("sponsor", e.target.value)} className="rounded bg-slate-900 p-2"><option value="">Sponsor</option>{sponsors.map((x)=><option key={x}>{x}</option>)}</select>
      <select defaultValue={params.get("sector") ?? ""} onChange={(e) => update("sector", e.target.value)} className="rounded bg-slate-900 p-2"><option value="">Sector</option>{sectors.map((x)=><option key={x}>{x}</option>)}</select>
      <select defaultValue={params.get("geography") ?? ""} onChange={(e) => update("geography", e.target.value)} className="rounded bg-slate-900 p-2"><option value="">Geography</option>{geographies.map((x)=><option key={x}>{x}</option>)}</select>
      <input type="date" defaultValue={params.get("from") ?? ""} onChange={(e) => update("from", e.target.value)} className="rounded bg-slate-900 p-2" />
      <input type="date" defaultValue={params.get("to") ?? ""} onChange={(e) => update("to", e.target.value)} className="rounded bg-slate-900 p-2" />
      <button onClick={() => router.push("/reports")} className="rounded border border-slate-700 px-3 py-2 text-sm">Reset</button>
    </div>
  );
}
