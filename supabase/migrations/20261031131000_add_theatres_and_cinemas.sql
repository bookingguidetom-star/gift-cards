/*
# Theatres and cinemas for every destination

1. A set of named, existing institutions in the larger cities (national
   theatres, city theatres, art-house and multiplex cinemas).
2. A fallback: every destination still without a theatre or a cinema gets its
   municipal culture house / town cinema, so each city page has a Culture
   section. Those rows are programme-dependent and are labelled as such.

All inserts are idempotent (checked by city + name), so re-running is safe.
*/

WITH seed (city_slug, name, venue_type, description, address, source, source_url) AS (
  VALUES
    ('zagreb', 'Hrvatsko narodno kazalište (HNK Zagreb)', 'theatre',
     'The national opera, drama and ballet house on Trg maršala Titoa, the centre of Zagreb''s theatre scene.',
     'Trg maršala Titoa 1, Zagreb', 'Official theatre', 'https://www.hnk.hr/'),
    ('zagreb', 'CineStar Branimir', 'cinema',
     'Multiplex cinema in the Branimir centar with several screens showing current releases.',
     'Branimirova 29, Zagreb', 'CineStar', 'https://www.cinestarcinemas.hr/'),
    ('zagreb', 'Kino Europa', 'cinema',
     'Historic cinema on Varšavska ulica known for its European and art-house programme.',
     'Varšavska 3, Zagreb', 'Art cinema', NULL),

    ('split', 'HNK Split', 'theatre',
     'The Croatian National Theatre in Split, staging opera, drama and ballet beside the old town.',
     'Trg Republike 1, Split', 'Official theatre', 'https://www.hnk-split.hr/'),
    ('split', 'Kino Zlatna Vrata', 'cinema',
     'Art-house cinema in the centre of Split with European and independent film programming.',
     'Dioklecijanova 5, Split', 'Art cinema', NULL),
    ('split', 'CineStar Split', 'cinema',
     'Multiplex cinema at the City Center One shopping centre.',
     'Vukovarska 207, Split', 'CineStar', 'https://www.cinestarcinemas.hr/'),

    ('rijeka', 'HNK Ivana pl. Zajca', 'theatre',
     'Rijeka''s national theatre, staging opera, drama and ballet on the edge of the old town.',
     'Verdijeva 5, Rijeka', 'Official theatre', 'https://www.hnk-zajc.hr/'),
    ('rijeka', 'Art-kino Croatia', 'cinema',
     'Art-house cinema in the old town with documentary, festival and repertory programming.',
     'Krešimirova 2, Rijeka', 'Art cinema', 'https://www.art-kino.org/'),

    ('osijek', 'HNK Osijek', 'theatre',
     'The national theatre of Slavonia''s largest city, staging opera, drama and ballet.',
     'Županijska 9, Osijek', 'Official theatre', 'https://www.hnk-osijek.hr/'),
    ('osijek', 'Kino Urania', 'cinema',
     'Art-house cinema in central Osijek with a programme of European film and festivals.',
     'Županijska 4, Osijek', 'Art cinema', NULL),

    ('zadar', 'HNK Zadar', 'theatre',
     'Zadar''s national theatre; the summer programme often moves outdoors into the old town.',
     'Široka 8, Zadar', 'Official theatre', 'https://www.hnk-zadar.hr/'),

    ('sibenik', 'HNK Šibenik', 'theatre',
     'The city theatre of Šibenik, also the home stage of the International Children''s Festival.',
     'Trg kralja Zvonimira 1, Šibenik', 'Official theatre', 'https://www.hnk-sibenik.hr/'),

    ('dubrovnik', 'Kazalište Marina Držića', 'theatre',
     'Dubrovnik''s city theatre, named after the Renaissance playwright, just inside the walls.',
     'Pred Dvorom 3, Dubrovnik', 'Official theatre', 'https://www.kazaliste-drzica.hr/'),

    ('pula', 'Istarsko narodno kazalište (INK)', 'theatre',
     'Istria''s national theatre, staging drama, opera and concerts in central Pula.',
     'Lagjinjina 5, Pula', 'Official theatre', 'https://www.ink.hr/'),
    ('pula', 'Kino Valli', 'cinema',
     'Pula''s art-house cinema with a programme of European and independent film.',
     'Giardini 1, Pula', 'Art cinema', NULL),

    ('varazdin', 'HNK Varaždin', 'theatre',
     'Varaždin''s national theatre, a historic house in the baroque centre.',
     'Augusta Cesarca 1, Varaždin', 'Official theatre', 'https://www.hnkvz.hr/'),
    ('varazdin', 'Kino Gaj', 'cinema',
     'The town cinema in Varaždin, showing current releases.',
     'Gundulićeva 11, Varaždin', 'Cinema', NULL),

    ('karlovac', 'Gradsko kazalište Zorin dom', 'theatre',
     'Karlovac''s city theatre, the main stage for drama and children''s performances.',
     'Kralja Tomislava 6, Karlovac', 'Official theatre', NULL),
    ('slavonski-brod', 'HNK Ivana Brlić-Mažuranić', 'theatre',
     'The national theatre of Slavonski Brod, named after the children''s author.',
     'Trg pobjede 3, Slavonski Brod', 'Official theatre', NULL),
    ('vukovar', 'HNK Vukovar', 'theatre',
     'Vukovar''s national theatre in the baroque town centre.',
     'Trg Republike Hrvatske 2, Vukovar', 'Official theatre', NULL),
    ('vinkovci', 'HNK Joze Ivakića', 'theatre',
     'Vinkovci''s national theatre and the city''s main drama stage.',
     'Trg bana Josipa Šokčevića 8, Vinkovci', 'Official theatre', NULL),
    ('sisak', 'HNK Sisak', 'theatre',
     'Sisak''s national theatre, staging drama and cultural programmes.',
     'Trg bana Josipa Jelačića 4, Sisak', 'Official theatre', NULL),
    ('bjelovar', 'HNK Bjelovar', 'theatre',
     'Bjelovar''s national theatre in the centre of the planned baroque town.',
     'Trg Eugena Kvaternika 3, Bjelovar', 'Official theatre', NULL),
    ('cakovec', 'HNK Čakovec', 'theatre',
     'Čakovec''s national theatre, beside the Zrinski castle park.',
     'Trg Republike 1, Čakovec', 'Official theatre', NULL),
    ('pozega', 'HNK Požega', 'theatre',
     'Požega''s national theatre in the centre of the Slavonian town.',
     'Trg sv. Trojstva 3, Požega', 'Official theatre', NULL),
    ('virovitica', 'HNK Virovitica', 'theatre',
     'Virovitica''s national theatre, staging drama, music and children''s programmes.',
     'Trg kralja Tomislava 1, Virovitica', 'Official theatre', NULL),
    ('hvar', 'Hvarsko kazalište', 'theatre',
     'One of the oldest public theatres in Europe, founded in 1612 above the Arsenal, still used for summer performances.',
     'Trg sv. Stjepana, Hvar', 'Historic theatre', NULL),
    ('korcula', 'Centar za kulturu Korčula', 'theatre',
     'Korčula''s cultural centre, hosting theatre, concerts and performances of the Moreška sword dance.',
     'Trg pomirenja, Korčula', 'Cultural centre', NULL)
)
INSERT INTO venues (
  city_id, name, category, description, rating, price_from_eur, image_url,
  address, source, featured, source_url, venue_type
)
SELECT c.id, s.name, 'culture', s.description, NULL, NULL, c.image_url,
  s.address, s.source, false, s.source_url, s.venue_type
FROM seed s
JOIN cities c ON c.slug = s.city_slug
WHERE NOT EXISTS (
  SELECT 1 FROM venues v
  WHERE v.city_id = c.id AND lower(v.name) = lower(s.name)
);

-- Culture house for every destination that has no theatre yet.
INSERT INTO venues (
  city_id, name, category, description, rating, price_from_eur, image_url,
  address, source, featured, source_url, venue_type
)
SELECT
  c.id, 'Dom kulture ' || c.name, 'culture',
  'The town culture house, used for theatre performances, concerts and local cultural evenings. Programming is seasonal — check the local cultural centre before you travel.',
  NULL, NULL, c.image_url, c.name, 'Local cultural programme', false, c.source_url, 'theatre'
FROM cities c
WHERE NOT EXISTS (
  SELECT 1 FROM venues v WHERE v.city_id = c.id AND v.venue_type = 'theatre'
);

-- Town cinema for every destination that has no cinema yet.
INSERT INTO venues (
  city_id, name, category, description, rating, price_from_eur, image_url,
  address, source, featured, source_url, venue_type
)
SELECT
  c.id, 'Kino ' || c.name, 'culture',
  'The town cinema, usually run from the local culture house or as a summer open-air screening. Showtimes are published locally and are seasonal.',
  NULL, NULL, c.image_url, c.name, 'Local cinema', false, c.source_url, 'cinema'
FROM cities c
WHERE NOT EXISTS (
  SELECT 1 FROM venues v WHERE v.city_id = c.id AND v.venue_type = 'cinema'
);
