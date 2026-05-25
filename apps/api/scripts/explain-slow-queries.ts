/**
 * Dev helper: EXPLAIN ANALYZE on hot list queries.
 * Usage: pnpm --filter @depanni/api exec tsx scripts/explain-slow-queries.ts
 */
import { prisma } from "../src/config/db.js";

async function explain(label: string, sql: string): Promise<void> {
  console.log(`\n=== ${label} ===`);
  const rows = await prisma.$queryRawUnsafe<{ "QUERY PLAN": string }[]>(
    `EXPLAIN ANALYZE ${sql}`,
  );
  for (const row of rows) console.log(row["QUERY PLAN"]);
}

async function main(): Promise<void> {
  await explain(
    "Jobs by citizen (cursor list)",
    `SELECT id, "createdAt" FROM "Job" WHERE "citizenId" = (SELECT id FROM "Citizen" LIMIT 1) ORDER BY "createdAt" DESC, id DESC LIMIT 21`,
  );
  await explain(
    "Missions by artisan",
    `SELECT id, "createdAt" FROM "Mission" WHERE "artisanId" = (SELECT id FROM "Artisan" LIMIT 1) ORDER BY "createdAt" DESC, id DESC LIMIT 21`,
  );
  await prisma.$disconnect();
}

void main();
