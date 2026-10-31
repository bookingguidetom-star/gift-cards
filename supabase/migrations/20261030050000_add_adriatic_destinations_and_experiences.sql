ALTER TABLE cities
  ADD COLUMN IF NOT EXISTS source_url text;

ALTER TABLE venues
  ADD COLUMN IF NOT EXISTS source_url text;

INSERT INTO cities (
  name, slug, region, short_description, long_description, image_url, lat, lng, source_url
) VALUES
(
  'Umag', 'umag', 'Istria',
  'A north-western Istrian port town on the Adriatic.',
  'Umag is a coastal town and port in north-western Istria. Its waterfront, historic centre, and Istrian setting make it a useful base for exploring the region.',
  'https://www.istra.hr/uploads/imgcache/article_878x450/articles/1526476505_5634.jpg',
  45.4372, 13.5257, 'https://www.istra.hr/en/destinations/umag'
),
(
  'Novigrad', 'novigrad', 'Istria',
  'A historic resort town on Istria’s west coast.',
  'Novigrad-Cittanova is a coastal town on the west coast of Istria, known for its historic centre and seaside setting.',
  'https://www.istra.hr/uploads/imgcache/article_878x450/articles/1526979331_7825.jpg',
  45.3165, 13.5584, 'https://www.istra.hr/en/destinations/novigrad'
),
(
  'Biograd na Moru', 'biograd-na-moru', 'Dalmatia',
  'A central Dalmatian coastal destination for sailing and water activities.',
  'Biograd na Moru is a seaside destination on the Adriatic. Its tourist board highlights sailing, fishing, diving, and other water sports alongside local culture and heritage.',
  'https://images.pexels.com/photos/33581260/pexels-photo-33581260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  43.9436, 15.4519, 'https://www.discover-biograd.com/en'
),
(
  'Primošten', 'primosten', 'Dalmatia',
  'A coastal town between Šibenik and Split with active sea experiences.',
  'Primošten is a Dalmatian coastal town between Šibenik and Split. Its tourist board highlights sailing, diving, rowing, cycling, and the town’s beaches and historic peninsula.',
  'https://visitprimosten.com/wp-content/uploads/2023/07/PTBxTimotej-2-1-830x1024.jpg',
  43.5866, 15.9230, 'https://visitprimosten.com/en/'
),
(
  'Crikvenica', 'crikvenica', 'Kvarner',
  'A seaside town on the Crikvenica Riviera.',
  'Crikvenica is part of the Crikvenica Riviera, a coastal area that also includes Dramalj, Jadranovo, and Selce, with seaside promenades and green parks.',
  'https://images.pexels.com/photos/29674356/pexels-photo-29674356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  45.1772, 14.6928, 'https://www.rivieracrikvenica.com/en'
),
(
  'Vodice', 'vodice', 'Dalmatia',
  'A Dalmatian seaside destination on the Adriatic coast.',
  'Vodice is a coastal destination in Dalmatia. Check the local tourist board for current visitor information, local activities, and seasonal availability.',
  'https://images.pexels.com/photos/17563088/pexels-photo-17563088.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  43.7608, 15.7828, 'https://www.vodice.hr/en'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO venues (
  city_id, name, category, description, rating, price_from_eur, image_url,
  address, source, featured, source_url, venue_type
)
SELECT c.id, v.name, v.category, v.description, NULL, NULL, v.image_url,
  NULL, v.source, false, v.source_url, v.venue_type
FROM (
  VALUES
    (
      'biograd-na-moru',
      'Biograd sailing, fishing & diving',
      'boat',
      'The official Biograd destination guide lists sailing, fishing, and diving among its local water activities. Contact operators directly for current routes, dates, and availability.',
      'Official Biograd tourist board',
      'https://www.discover-biograd.com/en',
      'water_activity'
    ),
    (
      'primosten',
      'Primošten sailing & sea activities',
      'boat',
      'The official Primošten destination guide highlights sailing, diving, and rowing on the Adriatic. Contact local operators directly for current trips and availability.',
      'Official Primošten tourist board',
      'https://visitprimosten.com/en/',
      'water_activity'
    ),
    (
      'crikvenica',
      'Crikvenica Riviera promenades & parks',
      'park',
      'Explore the seaside promenades and green parks of the Crikvenica Riviera; the official destination site also covers nearby Dramalj, Jadranovo, and Selce.',
      'Official Crikvenica Riviera tourism site',
      'https://www.rivieracrikvenica.com/en',
      'coastal_walk'
    ),
    (
      'rab',
      'Sailing around Rab',
      'boat',
      'Rab’s official tourism site describes the island’s sailing waters, bays, and marinas. Check local providers for current excursions and availability.',
      'Official Rab tourist board',
      'https://www.rab-visit.com/en/what-to-do/sailing/106',
      'sailing'
    )
) AS v(city_slug, name, category, description, source, source_url, venue_type)
JOIN cities c ON c.slug = v.city_slug
WHERE NOT EXISTS (
  SELECT 1 FROM venues existing
  WHERE existing.city_id = c.id AND lower(existing.name) = lower(v.name)
);
