import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getReport } from "@/lib/data";
import { ReportTabs } from "@/components/reports/report-tabs";

export default async function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReport(id);
  if (!report) notFound();

  return (
    <div className="space-y-4">
      <header className="card">
        <p className="text-sm text-slate-400">{format(report.reportDate, "yyyy-MM-dd")}</p>
        <h1 className="text-2xl font-semibold">{report.title}</h1>
        <p>{report.overviewSummary}</p>
        <div className="flex gap-2">{report.tags.map((tag)=><span key={tag} className="rounded-full bg-slate-800 px-2 py-1 text-xs">{tag}</span>)}</div>
      </header>
      <ReportTabs report={report} signals={report.signals} />
    </div>
  );
}
