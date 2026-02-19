import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl font-semibold">Admin</h1>
      <div className="grid gap-3 md:grid-cols-3">
        <Link className="card" href="/admin/new">Create report + signals</Link>
        <Link className="card" href="/admin/parse">Parse Narrative to Signals</Link>
        <a className="card" href="/samples/ingest_payload.json">Sample ingest payload</a>
      </div>
    </div>
  );
}
