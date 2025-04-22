-- supabase/migrations/0002_create_scores_table.sql
-- Migration to create the "scores" table for address-based scoreboards

-- Create scores table with camelCase columns
CREATE TABLE IF NOT EXISTS public.scores (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),

  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  "addressRaw" TEXT,
  "addressFormatted" TEXT,
  "addressCity" TEXT,
  "addressStateCode" CHAR(2),

  "siteNearest" TEXT,
  "siteNearestMiles" DOUBLE PRECISION,
  "sites1" TEXT[],
  "sites5" TEXT[],
  "sites10" TEXT[],
  "sites20" TEXT[],
  "sites50" TEXT[]
);
