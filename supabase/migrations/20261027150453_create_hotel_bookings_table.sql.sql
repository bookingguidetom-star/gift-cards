/*
# Create hotel_bookings table

1. Purpose
- Lets visitors select check-in/check-out dates and book a hotel room directly.
- Stores guest name, email, dates, guest count, and booking reference.

2. New Tables
- `hotel_bookings`
  - id (uuid, primary key)
  - venue_id (uuid, foreign key to venues.id)
  - guest_name (text, not null)
  - guest_email (text, not null)
  - check_in (date, not null)
  - check_out (date, not null)
  - guests (integer, not null, default 1)
  - status (text, not null, default 'confirmed')
  - reference (text, not null, unique — short booking code)
  - total_eur (numeric, not null)
  - special_requests (text, nullable)
  - created_at (timestamptz, default now())

3. Security
- Enable RLS.
- Grant CRUD to anon + authenticated (no-auth app).
- Allow anon + authenticated to insert and read (public booking flow).
*/

CREATE TABLE IF NOT EXISTS hotel_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests integer NOT NULL DEFAULT 1 CHECK (guests >= 1 AND guests <= 10),
  status text NOT NULL DEFAULT 'confirmed',
  reference text NOT NULL UNIQUE,
  total_eur numeric(10,2) NOT NULL,
  special_requests text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT check_out_after_check_in CHECK (check_out > check_in)
);

ALTER TABLE hotel_bookings ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON hotel_bookings TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_bookings" ON hotel_bookings;
CREATE POLICY "public_read_bookings" ON hotel_bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_bookings" ON hotel_bookings;
CREATE POLICY "public_insert_bookings" ON hotel_bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_bookings" ON hotel_bookings;
CREATE POLICY "public_update_bookings" ON hotel_bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "public_delete_bookings" ON hotel_bookings;
CREATE POLICY "public_delete_bookings" ON hotel_bookings FOR DELETE
  TO anon, authenticated USING (true);
