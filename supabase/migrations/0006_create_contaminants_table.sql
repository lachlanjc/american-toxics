-- supabase/migrations/0006_create_contaminants_table.sql
-- Migration to create the "contaminants" table

CREATE TABLE IF NOT EXISTS public.contaminants (
  id TEXT PRIMARY KEY,
  nameRaw TEXT NOT NULL,
  name TEXT NOT NULL,
  summary TEXT,
  contexts TEXT[],
  "siteCount" INTEGER DEFAULT 0,
  "epaPdfUrl" TEXT,
  "wikipediaUrl" TEXT
);
-- link images to contaminants via foreign key
ALTER TABLE public.images
  ADD COLUMN contaminantId TEXT REFERENCES public.contaminants(id) ON DELETE CASCADE;
