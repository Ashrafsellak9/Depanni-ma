-- Performance indexes for cursor-paginated list queries
CREATE INDEX IF NOT EXISTS "Job_citizenId_createdAt_id_idx" ON "Job"("citizenId", "createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "Mission_artisanId_createdAt_id_idx" ON "Mission"("artisanId", "createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "Mission_status_createdAt_idx" ON "Mission"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Citizen_createdAt_id_idx" ON "Citizen"("createdAt" DESC, "id" DESC);
CREATE INDEX IF NOT EXISTS "Artisan_createdAt_id_idx" ON "Artisan"("createdAt" DESC, "id" DESC);
