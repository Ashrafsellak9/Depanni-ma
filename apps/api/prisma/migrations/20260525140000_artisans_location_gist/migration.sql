-- Restore PostGIS geography + GIST index on artisans (removed by prior migrations)

ALTER TABLE "artisans" ADD COLUMN IF NOT EXISTS "location" geography(Point, 4326);

UPDATE "artisans"
SET "location" = ST_SetSRID(ST_MakePoint("lng", "lat"), 4326)::geography
WHERE "lat" IS NOT NULL
  AND "lng" IS NOT NULL;

CREATE INDEX IF NOT EXISTS "artisans_location_gix" ON "artisans" USING GIST ("location");
