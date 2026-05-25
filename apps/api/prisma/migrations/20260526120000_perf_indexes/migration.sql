-- Performance indexes for cursor-paginated list queries
CREATE INDEX IF NOT EXISTS "jobs_citizenId_createdAt_id_idx" ON "jobs"("citizenId", "createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "missions_artisanId_createdAt_id_idx" ON "missions"("artisanId", "createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "missions_status_createdAt_idx" ON "missions"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "citizens_createdAt_id_idx" ON "citizens"("createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "artisans_createdAt_id_idx" ON "artisans"("createdAt" DESC, "id" DESC);
