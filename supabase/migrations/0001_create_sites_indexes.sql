-- supabase/migrations/0001_create_sites_table.sql
-- Migration to create the "sites" table matching lib/data/sites.json schema

-- Indexes for common filters
CREATE INDEX IF NOT EXISTS idx_sites_state_code ON public.sites(state_code);
CREATE INDEX IF NOT EXISTS idx_sites_npl ON public.sites(npl);
CREATE INDEX IF NOT EXISTS idx_sites_category ON public.sites(category);
