CREATE TABLE IF NOT EXISTS venue_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  venue_id uuid REFERENCES venues(id) ON DELETE SET NULL,
  title text NOT NULL,
  event_type text NOT NULL,
  description text,
  start_date date NOT NULL,
  end_date date,
  start_month smallint NOT NULL,
  date_precision text NOT NULL DEFAULT 'day'
    CHECK (date_precision IN ('day', 'month')),
  is_recurring boolean NOT NULL DEFAULT false,
  schedule_note text,
  ticket_url text,
  source_url text,
  price_range text,
  event_venue text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CHECK (start_month BETWEEN 1 AND 12),
  CHECK (end_date IS NULL OR end_date >= start_date),
  CHECK (
    date_precision <> 'month'
    OR (
      EXTRACT(DAY FROM start_date) = 1
      AND (end_date IS NULL OR EXTRACT(DAY FROM end_date) = 1)
    )
  )
);

CREATE INDEX IF NOT EXISTS idx_venue_events_city_start_date
  ON venue_events (city_id, start_date);
CREATE INDEX IF NOT EXISTS idx_venue_events_venue_start_date
  ON venue_events (venue_id, start_date);

ALTER TABLE venue_events ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON venue_events TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_venue_events" ON venue_events;
CREATE POLICY "public_read_venue_events" ON venue_events
  FOR SELECT TO anon, authenticated USING (true);
