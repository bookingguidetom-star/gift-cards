-- Add a specialties JSON column to cities — a list of signature products, dishes, and cultural highlights
ALTER TABLE cities
  ADD COLUMN IF NOT EXISTS specialties jsonb DEFAULT '[]'::jsonb;
