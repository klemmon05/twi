CREATE TYPE "SignalType" AS ENUM ('STRUCTURAL_TRIGGER', 'QUIET_SIGNAL');
CREATE TYPE "Confidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

CREATE TABLE "Report" (
  "id" TEXT PRIMARY KEY,
  "reportDate" TIMESTAMP(3) NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "overviewSummary" TEXT NOT NULL,
  "narrativeBody" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "searchVector" tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce("title", '') || ' ' || coalesce("overviewSummary", '') || ' ' || coalesce("narrativeBody", ''))
  ) STORED
);

CREATE TABLE "Signal" (
  "id" TEXT PRIMARY KEY,
  "reportId" TEXT NOT NULL REFERENCES "Report"("id") ON DELETE CASCADE,
  "companyName" TEXT NOT NULL,
  "sponsor" TEXT NOT NULL,
  "sector" TEXT NOT NULL,
  "geography" TEXT,
  "signalType" "SignalType" NOT NULL,
  "confidence" "Confidence" NOT NULL,
  "signalSummary" TEXT NOT NULL,
  "evidenceBullets" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "peopleMentioned" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "keywords" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "searchVector" tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce("companyName", '') || ' ' || coalesce("sponsor", '') || ' ' || coalesce("sector", '') || ' ' ||
    coalesce("signalSummary", '') || ' ' || array_to_string("evidenceBullets", ' ') || ' ' || array_to_string("keywords", ' ') || ' ' ||
    array_to_string("peopleMentioned", ' '))
  ) STORED
);

CREATE TABLE "Source" (
  "id" TEXT PRIMARY KEY,
  "signalId" TEXT NOT NULL REFERENCES "Signal"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "publisher" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "date" TIMESTAMP(3) NOT NULL,
  "quote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "Signal_reportId_idx" ON "Signal"("reportId");
CREATE INDEX "Signal_sponsor_idx" ON "Signal"("sponsor");
CREATE INDEX "Signal_sector_idx" ON "Signal"("sector");
CREATE INDEX "Report_search_idx" ON "Report" USING GIN("searchVector");
CREATE INDEX "Signal_search_idx" ON "Signal" USING GIN("searchVector");
