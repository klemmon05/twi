"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

type HostedPayload = {
  title: string;
  reportDate: string;
  content: string;
};

const defaultContent = `# Market Sensing Report\n\n## Executive Summary\n- Add your daily synthesis here.\n- Call out key movements and implications.\n\n## Signals\n1. **Company / Sponsor** — signal summary\n2. **Company / Sponsor** — signal summary\n\n## So What\nSummarize what matters most for tomorrow's pipeline and outreach.`;

function encodePayload(payload: HostedPayload) {
  if (typeof window === "undefined") return "";
  return window.btoa(encodeURIComponent(JSON.stringify(payload)));
}

export default function MarketSensingBuilderPage() {
  const [title, setTitle] = useState("Daily Market Sensing Report");
  const [reportDate, setReportDate] = useState(new Date().toISOString().slice(0, 10));
  const [content, setContent] = useState(defaultContent);

  const shareLink = useMemo(() => {
    const payload: HostedPayload = { title, reportDate, content };
    return `/market-sensing/view#report=${encodePayload(payload)}`;
  }, [content, reportDate, title]);

  return (
    <div className="space-y-6">
      <section className="card space-y-3">
        <h1 className="text-3xl font-bold">Market Sensing Report Publisher</h1>
        <p className="text-slate-300">
          Paste the day&apos;s prompt output and publish it as a clean, shareable hosted page.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Input</h2>
          <label className="block space-y-1">
            <span className="text-sm text-slate-400">Report title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-400">Date</span>
            <input
              type="date"
              value={reportDate}
              onChange={(e) => setReportDate(e.target.value)}
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm text-slate-400">Prompt output (Markdown supported)</span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="h-[360px] w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 font-mono text-sm"
            />
          </label>
          <div className="rounded border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
            <p className="font-medium text-slate-100">Hosted link</p>
            <p className="mt-1 break-all">{shareLink}</p>
            <Link href={shareLink} className="mt-3 inline-block rounded bg-blue-600 px-3 py-2 text-white">
              Open hosted view
            </Link>
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="text-xl font-semibold">Preview</h2>
          <div className="rounded border border-slate-700 bg-slate-950 p-5">
            <p className="text-xs uppercase tracking-wide text-blue-300">Market Sensing Report</p>
            <h3 className="mt-1 text-2xl font-semibold">{title || "Untitled report"}</h3>
            <p className="text-sm text-slate-400">{reportDate}</p>
            <article className="mt-5 space-y-4 text-slate-100 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-semibold [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:pl-5">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
