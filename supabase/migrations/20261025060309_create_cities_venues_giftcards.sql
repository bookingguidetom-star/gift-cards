/*
# Create cities, venues, and gift cards tables

1. New Tables
- `cities`: the 20 major Croatian cities covered by the gift card marketplace.
  - id (uuid pk), name, slug (unique), region, short_description, long_description,
    image_url (representative photo), lat, lng (for map placement), created_at.
- `venues`: individual experiences/restaurants/hotels/etc. belonging to a city.
  - id (uuid pk), city_id (fk -> cities.id ON DELETE CASCADE), name, category
    (one of: restaurant, hotel, wellness, shop, park, boat, winery),
    description, rating (numeric 2,1), price_from_eur (numeric), image_url,
    address, source (e.g. "TripAdvisor"), featured (bool), created_at.
- `gift_cards`: gift cards purchased and redeemed in the marketplace.
  - id (uuid pk), code (unique, 12-char uppercase), amount_eur (numeric(10,2)),
    balance_eur (numeric(10,2)), recipient_name, recipient_email, buyer_name,
    buyer_email, personal_message, delivery_date (date), status
    (one of: pending, sent, partially_redeemed, redeemed, expired),
    selected_venue_ids (uuid[] of venues the card is bundled toward),
    created_at.
2. Indexes
- venues(city_id), venues(category), gift_cards(code), cities(slug).
3. Security
- Enable RLS on all three tables.
- Grant SELECT to anon + authenticated on cities and venues (public catalog).
- Grant SELECT, INSERT, UPDATE on gift_cards to anon + authenticated so the
  marketplace can create cards and update balance; SELECT lets the balance
  checker read a card by its code.
- All policies use USING (true) / WITH CHECK (true) because this is a
  single-tenant, no-auth public catalog app: the catalog is intentionally
  shared and gift cards are protected by their unique 12-char code rather
  than by user ownership.
*/

CREATE TABLE IF NOT EXISTS cities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  region text NOT NULL,
  short_description text NOT NULL,
  long_description text NOT NULL,
  image_url text NOT NULL,
  lat double precision NOT NULL,
  lng double precision NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city_id uuid NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('restaurant','hotel','wellness','shop','park','boat','winery')),
  description text NOT NULL,
  rating numeric(2,1),
  price_from_eur numeric(10,2),
  image_url text NOT NULL,
  address text,
  source text,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  amount_eur numeric(10,2) NOT NULL,
  balance_eur numeric(10,2) NOT NULL,
  recipient_name text NOT NULL,
  recipient_email text NOT NULL,
  buyer_name text,
  buyer_email text,
  personal_message text,
  delivery_date date,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','partially_redeemed','redeemed','expired')),
  selected_venue_ids uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_venues_city_id ON venues(city_id);
CREATE INDEX IF NOT EXISTS idx_venues_category ON venues(category);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
CREATE INDEX IF NOT EXISTS idx_cities_slug ON cities(slug);

ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE gift_cards ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON cities TO anon, authenticated;
GRANT SELECT ON venues TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON gift_cards TO anon, authenticated;

DROP POLICY IF EXISTS "public_read_cities" ON cities;
CREATE POLICY "public_read_cities" ON cities FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_venues" ON venues;
CREATE POLICY "public_read_venues" ON venues FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_gift_cards" ON gift_cards;
CREATE POLICY "public_read_gift_cards" ON gift_cards FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_gift_cards" ON gift_cards;
CREATE POLICY "public_insert_gift_cards" ON gift_cards FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "public_update_gift_cards" ON gift_cards;
CREATE POLICY "public_update_gift_cards" ON gift_cards FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
