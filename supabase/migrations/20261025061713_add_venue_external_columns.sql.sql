-- Add columns to support external links (TripAdvisor, Booking.com, winery sites)
-- and richer venue data
ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS external_url text,
  ADD COLUMN IF NOT EXISTS external_label text,
  ADD COLUMN IF NOT EXISTS website_url text,
  ADD COLUMN IF NOT EXISTS venue_type text DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS tripadvisor_rating numeric,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS neighborhood text;

-- Backfill existing rows with a default venue_type
UPDATE venues SET venue_type = 'general' WHERE venue_type IS NULL;
