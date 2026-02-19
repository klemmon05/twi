import { z } from "zod";

export const sourceSchema = z.object({
  title: z.string().min(1),
  publisher: z.string().min(1),
  url: z.string().url(),
  date: z.string(),
  quote: z.string().max(150).optional()
});

export const signalSchema = z.object({
  company_name: z.string().min(1),
  sponsor: z.string().min(1),
  sector: z.string().min(1),
  geography: z.string().optional(),
  signal_type: z.enum(["Structural Trigger", "Quiet Signal"]),
  confidence: z.enum(["High", "Medium", "Low"]),
  signal_summary: z.string().min(10),
  evidence_bullets: z.array(z.string()).default([]),
  sources: z.array(sourceSchema).default([]),
  people_mentioned: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([])
});

export const reportSchema = z.object({
  report_date: z.string(),
  title: z.string().min(5),
  overview_summary: z.string().min(10),
  narrative_body: z.string().min(20),
  tags: z.array(z.string()).default([])
});

export const ingestSchema = z.object({
  report: reportSchema,
  signals: z.array(signalSchema)
});
