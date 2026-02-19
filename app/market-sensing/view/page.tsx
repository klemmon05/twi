"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type HostedPayload = {
  title: string;
  reportDate: string;
  content: string;
};

function decodePayload(raw: string): HostedPayload | null {
  try {
    const decoded = decodeURIComponent(window.atob(raw));
    const parsed = JSON.parse(decoded) as HostedPayload;
    if (!parsed.title || !parsed.reportDate || !parsed.content) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export default function HostedMarketSensingPage() {
  const [payload, setPayload] = useState<HostedPayload | null>(null);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    const params = new URLSearchParams(hash);
    const encoded = params.get("report");
    if (!encoded) return;
    setPayload(decodePayload(encoded));
  }, []);

  if (!payload) {
    return (
      <div className="card space-y-3">
        <h1 className="text-2xl font-semibold">No hosted report data found</h1>
        <p className="text-slate-300">
          Open this page from the Market Sensing Report Publisher to include the report payload.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <section className="card border-blue-500/30 bg-gradient-to-b from-slate-950 to-slate-900 p-8">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Market Sensing Report</p>
        <h1 className="mt-2 text-4xl font-bold leading-tight">{payload.title}</h1>
        <p className="mt-2 text-slate-300">{payload.reportDate}</p>
        <article className="mt-8 space-y-4 text-lg text-slate-100 [&_h1]:mt-8 [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:pl-6">
          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{payload.content}</ReactMarkdown>
        </article>
      </section>
    </div>
  );
}
