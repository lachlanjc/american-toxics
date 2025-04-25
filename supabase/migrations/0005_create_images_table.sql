-- supabase/migrations/0005_create_images_table.sql
-- Migration to create the "images" table

CREATE TABLE IF NOT EXISTS public.images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  blurhash TEXT,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  caption TEXT,
  source TEXT,
  siteId TEXT REFERENCES public.sites(id)
);
