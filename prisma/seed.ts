import { subDays } from "date-fns";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.source.deleteMany();
  await prisma.signal.deleteMany();
  await prisma.report.deleteMany();

  const sponsors = ["KKR", "Bain Capital", "Apollo", "TPG", "Carlyle"];
  const sectors = ["Healthcare", "Industrial", "Technology", "Consumer", "Business Services"];

  for (let i = 0; i < 3; i++) {
    const date = subDays(new Date(), i);
    const report = await prisma.report.create({
      data: {
        reportDate: date,
        title: `Daily Private Equity Transformation Trigger Report — ${date.toISOString().slice(0, 10)}`,
        overviewSummary: "Portfolio-wide signals indicate acceleration in cost, digital, and commercial transformations.",
        narrativeBody: `## Daily narrative for ${date.toISOString().slice(0, 10)}\n\nMultiple sponsors initiated ERP and AI-led operating model initiatives.`,
        tags: ["daily", "portfolio", i === 0 ? "latest" : "archive"]
      }
    });

    for (let j = 0; j < 7; j++) {
      if (i === 2 && j === 6) break;
      await prisma.signal.create({
        data: {
          reportId: report.id,
          companyName: `Company ${i}-${j}`,
          sponsor: sponsors[(i + j) % sponsors.length],
          sector: sectors[(j + i) % sectors.length],
          geography: j % 2 === 0 ? "North America" : "Europe",
          signalType: j % 2 === 0 ? "STRUCTURAL_TRIGGER" : "QUIET_SIGNAL",
          confidence: j % 3 === 0 ? "HIGH" : j % 3 === 1 ? "MEDIUM" : "LOW",
          signalSummary: "Programmatic margin expansion with technology and talent operating model redesign.",
          evidenceBullets: ["Transformation office launched", "Cross-functional PMO cadence increased"],
          peopleMentioned: ["COO", "Transformation Lead"],
          keywords: ["ERP", "AI", "pricing"],
          sources: {
            create: [
              {
                title: `Source ${i}-${j}`,
                publisher: "Financial Daily",
                url: `https://example.com/source-${i}-${j}`,
                date,
                quote: "Management sees rapid value creation through process redesign."
              }
            ]
          }
        }
      });
    }
  }
}

main().finally(async () => {
  await prisma.$disconnect();
});
