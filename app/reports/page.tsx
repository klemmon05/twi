import Link from "next/link";
import { format } from "date-fns";
import { FilterBar } from "@/components/signals/filter-bar";
import { getFacetOptions, getReports, searchSignals } from "@/lib/data";

export default async function ReportsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  const page = Number(params.page ?? "1");
  const [reports, facets, result] = await Promise.all([
    getReports(),
    getFacetOptions(),
    searchSignals({ ...params, page })
  ]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Reports Index</h1>
      <FilterBar sponsors={facets.sponsors} sectors={facets.sectors} geographies={facets.geographies} />
      <section className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="card">
              <p className="text-sm text-slate-400">{format(report.reportDate, "yyyy-MM-dd")}</p>
              <Link href={`/reports/${report.id}`} className="font-medium hover:text-blue-300">{report.title}</Link>
              <p className="text-sm text-slate-300">{report.signals.length} signals</p>
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">Structured signal results ({result.total})</h2>
          {result.items.map((signal) => (
            <div key={signal.id} className="card">
              <Link href={`/signals/${signal.id}`} className="font-medium">{signal.companyName}</Link>
              <p className="text-sm">{signal.sponsor} · {signal.sector} · {signal.confidence}</p>
              <p className="text-sm text-slate-300">{signal.signalSummary}</p>
            </div>
          ))}
          <div className="flex gap-2">
            {page > 1 && <Link className="rounded border px-2 py-1" href={`/reports?${new URLSearchParams({ ...params, page: String(page - 1) })}`}>Prev</Link>}
            {result.total > page * result.pageSize && <Link className="rounded border px-2 py-1" href={`/reports?${new URLSearchParams({ ...params, page: String(page + 1) })}`}>Next</Link>}
          </div>
        </div>
      </section>
    </div>
  );
}
