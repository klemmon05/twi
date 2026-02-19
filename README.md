# ProSignal Analytics

ProSignal Analytics is a production-ready Next.js web app for managing daily **Transformation Trigger Reports** with narrative + structured signal intelligence.

## Architecture summary

- **Frontend**: Next.js App Router + TypeScript + Tailwind CSS.
- **UI pattern**: Reusable card-based components with narrative/structured dual-mode rendering.
- **Backend**: Next.js Route Handlers for ingest/search/analytics.
- **Database**: Postgres (Supabase-ready) + Prisma ORM.
- **Auth**: Lightweight admin cookie guard via `ADMIN_SECRET`.
- **Search**:
  - App-level faceted filtering through Prisma query layer.
  - Postgres tsvector columns + GIN indexes added in migration for narrative + signal full-text search readiness.
- **Analytics**: Recharts-powered Trends page (time-series, sponsor frequency, sector mix, confidence distribution).

## Page map

- `/` Home: latest report preview, quick stats, facet summary.
- `/reports` Reports index + global signal search/filtering + pagination.
- `/reports/[id]` Report detail with tabs:
  - Narrative (sanitized markdown)
  - Signals (table/card toggle)
- `/signals/[id]` Signal detail + sources.
- `/sponsors/[name]` Sponsor profile and confidence mix.
- `/trends` Trends & analytics dashboard.
- `/admin` Protected admin area.
- `/admin/new` Bulk JSON report ingest.
- `/admin/parse` Parse Narrative to Signals workflow.

## Data model

### Report
- id
- reportDate (unique)
- title
- overviewSummary
- narrativeBody
- tags[]
- createdAt, updatedAt

### Signal
- id
- reportId
- companyName
- sponsor
- sector
- geography
- signalType (`STRUCTURAL_TRIGGER` | `QUIET_SIGNAL`)
- confidence (`HIGH` | `MEDIUM` | `LOW`)
- signalSummary
- evidenceBullets[]
- peopleMentioned[]
- keywords[]
- createdAt, updatedAt

### Source
- title, publisher, url, date, quote

## Local development

```bash
npm install
cp .env.example .env
npm run prisma:generate
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Open `http://localhost:3000`.

## Environment variables

Create `.env`:

```bash
DATABASE_URL="postgresql://..."
ADMIN_SECRET="change-me"
```

## Supabase setup

1. Create a Supabase project.
2. Copy the Postgres connection string into `DATABASE_URL`.
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed sample data:
   ```bash
   npm run prisma:seed
   ```

## API ingestion

### Endpoint
`POST /api/ingest`

- Requires admin cookie (sign in via `/auth/signin`).
- Validates request with Zod.
- Upserts report by date and stores signals + nested sources.

Sample payload: `/samples/ingest_payload.json`

## Deployment (Vercel preferred)

1. Push repository to GitHub.
2. Import project in Vercel.
3. Add env vars: `DATABASE_URL`, `ADMIN_SECRET`.
4. Build command: `npm run build`
5. Run migrations in CI/CD or a post-deploy step:
   ```bash
   npx prisma migrate deploy
   ```

## File tree (key files)

```text
app/
  page.tsx
  reports/page.tsx
  reports/[id]/page.tsx
  trends/page.tsx
  sponsors/[name]/page.tsx
  signals/[id]/page.tsx
  admin/page.tsx
  admin/new/page.tsx
  admin/parse/page.tsx
  api/ingest/route.ts
  api/search/route.ts
  api/reports/[id]/route.ts
  api/analytics/route.ts
components/
  layout/site-header.tsx
  reports/report-tabs.tsx
  signals/filter-bar.tsx
  charts/trends-dashboard.tsx
lib/
  prisma.ts
  data.ts
  validators.ts
  auth.ts
prisma/
  schema.prisma
  migrations/20250219000000_init/migration.sql
  seed.ts
public/samples/
  ingest_payload.json
middleware.ts
```
