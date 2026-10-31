WITH event_seed (
  city_slug, title, event_type, description, start_date, end_date, start_month,
  date_precision, is_recurring, schedule_note, event_venue, source_url
) AS (
  VALUES
    (
      'zagreb', 'Advent Zagreb', 'festival',
      'The city’s seasonal Advent programme of lights, food, music, and gatherings.',
      DATE '2026-11-28', DATE '2027-01-07', 11, 'day', false,
      'Official 2026–27 dates are published; future editions may differ.',
      'Zagreb', 'https://www.adventzagreb.hr/'
    ),
    (
      'varazdin', 'Špancirfest', 'festival',
      'A ten-day street festival with performances, concerts, workshops, and exhibitions in the historic centre.',
      DATE '2027-08-01', NULL, 8, 'month', true,
      'Usually held in late August; 2027 dates have not been published.',
      'Varaždin historic centre', 'https://www.spancirfest.com/en/about-spancirfest/'
    ),
    (
      'osijek', 'Osijek Cultural Summer', 'festival',
      'A city cultural programme featuring concerts, theatre, exhibitions, film, and literary events.',
      DATE '2027-06-01', DATE '2027-08-01', 6, 'month', true,
      'The 2027 programme and dates have not been published; the month range reflects the recent programme.',
      'Osijek', 'https://www.tzosijek.hr/osjecko-ljeto-kulture-2026-1507'
    ),
    (
      'osijek', 'Advent in Osijek', 'festival',
      'Osijek’s traditional December Advent programme of seasonal food, crafts, lights, and activities.',
      DATE '2027-12-01', NULL, 12, 'month', true,
      'December event; 2027 programme and dates have not been published.',
      'Tvrđa and central Osijek', 'https://www.tzosijek.hr/advent-u-osijeku-1259'
    ),
    (
      'rovinj', 'Weekend Media Festival', 'festival',
      'Regional festival for media, communications, marketing, digital, IT, and technology.',
      DATE '2027-09-23', DATE '2027-09-26', 9, 'day', false,
      'The 2027 edition dates are listed by the Istria destination calendar.',
      'Rovinj', 'https://www.istra.hr/en/destinations/rovinj/events/28562'
    ),
    (
      'pula', 'Pula Film Festival', 'film_festival',
      'Annual Croatian and international film festival hosted in Pula.',
      DATE '2027-07-01', NULL, 7, 'month', true,
      'Usually held in July; 2027 dates have not been published.',
      'Pula', 'https://pulafilmfestival.hr/73-novosti/'
    ),
    (
      'porec', 'Porečdox', 'film_festival',
      'International documentary film festival in Poreč.',
      DATE '2027-11-01', NULL, 11, 'month', true,
      'The 2026 edition was listed in November; 2027 dates have not been published.',
      'Poreč', 'https://www.istra.hr/en/destinations/porec/events/27735'
    ),
    (
      'porec', 'CROFISH', 'exhibition',
      'International fisheries and fishing-equipment fair with professional and public activities.',
      DATE '2027-11-01', NULL, 11, 'month', true,
      'The 2026 edition was listed in November; 2027 dates have not been published.',
      'Poreč', 'https://www.istra.hr/en/destinations/porec/events/28433'
    ),
    (
      'motovun', 'Teran Wine & Truffle Festival', 'festival',
      'Local wine and truffle festival featuring regional producers.',
      DATE '2027-10-01', NULL, 10, 'month', true,
      'Usually held in October; 2027 dates have not been published.',
      'Motovun', 'https://www.tz-motovun.hr/en/'
    ),
    (
      'umag', 'Croatia Open Umag', 'sport',
      'International tennis tournament with an accompanying entertainment programme.',
      DATE '2027-07-01', NULL, 7, 'month', true,
      'Usually held in summer; 2027 dates have not been published.',
      'Umag', 'https://www.croatiaopen.hr/en/'
    ),
    (
      'sibenik', 'International Children’s Festival (MDF)', 'festival',
      'Šibenik’s international festival of children’s theatre, arts, and workshops.',
      DATE '2027-06-12', DATE '2027-06-26', 6, 'day', false,
      'The organizer has published the 2027 edition dates.',
      'Šibenik', 'https://www.mdf-sibenik.com/poziv-za-sudjelovanjem-na-67-mdf-u/'
    ),
    (
      'biograd-na-moru', 'Biograd Boat Show', 'exhibition',
      'In-water boat show and nautical-industry event.',
      DATE '2027-10-01', NULL, 10, 'month', true,
      'The 2026 show was scheduled for October; exact 2027 dates have not been published.',
      'Biograd na Moru', 'https://www.bbs.com.hr/'
    ),
    (
      'primosten', 'Primošten Summer Cultural Programme', 'festival',
      'Seasonal programme of cultural events, concerts, and folklore performances.',
      DATE '2027-06-01', DATE '2027-08-01', 6, 'month', true,
      'The tourist board describes summer programming; the 2027 programme and dates are not yet published.',
      'Primošten', 'https://visitprimosten.com/'
    ),
    (
      'vodice', 'Days of Young Olive Oil in Dalmatia', 'exhibition',
      'Olive-oil event listed by the Vodice Tourist Board.',
      DATE '2026-12-05', NULL, 12, 'day', false,
      'The official Tourist Board lists this event for 5 December 2026.',
      'Hotel Imperial, Vodice', 'https://www.vodice.hr/en/events'
    ),
    (
      'vodice', 'Advent in Vodice', 'festival',
      'Seasonal Advent programme in the town park with food and entertainment.',
      DATE '2026-12-11', DATE '2027-01-02', 12, 'day', false,
      'The official Tourist Board lists the 2026–27 dates.',
      'Town park, Trg kneza Branimira', 'https://www.vodice.hr/en/events'
    ),
    (
      'vodice', 'Regatta Jabuka', 'sport',
      'Offshore sailing race on the Vodice–Jabuka–Vodice route.',
      DATE '2027-11-01', NULL, 11, 'month', true,
      'Traditionally held in November; exact 2027 dates have not been verified.',
      'Vodice', 'https://www.regata-jabuka.com/index.php/en/'
    ),
    (
      'pag', 'Ostatak života (The Rest of Life)', 'performance',
      'A one-person performance combining monodrama, stand-up, clowning, and slapstick.',
      DATE '2026-11-04', NULL, 11, 'day', false,
      'Listed in the City of Pag’s November 2026 Kulturna bura programme.',
      'Pag', 'https://www.pag.hr/index.php/gradska-uprava/novosti-aktualnosti/4243-kulturna-bura-donosi-bogat-program-u-studenome'
    ),
    (
      'pag', 'Embroidery Workshop', 'workshop',
      'Workshop for children and adults introducing embroidery techniques.',
      DATE '2026-11-28', NULL, 11, 'day', false,
      'Listed in the City of Pag’s November 2026 Kulturna bura programme.',
      'Pag', 'https://www.pag.hr/index.php/gradska-uprava/novosti-aktualnosti/4243-kulturna-bura-donosi-bogat-program-u-studenome'
    ),
    (
      'pag', 'Mali princ (The Little Prince)', 'performance',
      'Stage adaptation of The Little Prince for children and adults.',
      DATE '2026-11-29', NULL, 11, 'day', false,
      'Listed in the City of Pag’s November 2026 Kulturna bura programme.',
      'Pag', 'https://www.pag.hr/index.php/gradska-uprava/novosti-aktualnosti/4243-kulturna-bura-donosi-bogat-program-u-studenome'
    ),
    (
      'split', 'Split Summer Festival', 'festival',
      'Summer programme of theatre, music, and other performances in Split.',
      DATE '2027-07-01', DATE '2027-08-01', 7, 'month', true,
      'Usually held in July and August; 2027 dates have not been published.',
      'Split', 'https://split.hr/kalendar/en/city-split-calendar/72nd-split-summer-festival'
    ),
    (
      'dubrovnik', 'Dubrovnik Summer Festival', 'festival',
      'Summer festival programme of theatre, music, dance, and other performances.',
      DATE '2027-07-01', DATE '2027-08-01', 7, 'month', true,
      'Usually held in July and August; 2027 dates have not been published.',
      'Dubrovnik', 'https://www.dubrovnik-festival.hr/en/article/the-77th-dubrovnik-summer-festival-brings-eight-theatre-productions-and-an-outstanding-cast/363'
    ),
    (
      'hvar', 'Hvar Summer Festival', 'festival',
      'Summer programme of music, theatre, dance, and visual arts.',
      DATE '2027-06-01', DATE '2027-09-01', 6, 'month', true,
      'The 2026 season ran through summer; 2027 programme dates have not been published.',
      'Hvar', 'https://visithvar.hr/65th-hvar-summer-festival-opening-ceremony-hvar-2026/'
    ),
    (
      'korcula', 'Moreška Sword Dance', 'dance',
      'Traditional Korčula sword-dance performance presented during the summer season.',
      DATE '2027-06-01', DATE '2027-08-01', 6, 'month', true,
      'Performed during summer; check the organizer for the 2027 performance schedule.',
      'Korčula', 'https://moreska.hr/en/'
    ),
    (
      'trogir', 'Trogir Summer Festival', 'festival',
      'Summer programme including concerts, theatre, exhibitions, and local events.',
      DATE '2027-07-01', DATE '2027-09-01', 7, 'month', true,
      'Recent editions ran during July–September; 2027 dates have not been published.',
      'Trogir', 'https://www.visittrogir.hr/en/tourist/events/54th-trogir-summer-festival'
    ),
    (
      'cavtat', 'Epidaurus Cavtat Festival', 'festival',
      'Festival programme spanning music, theatre, opera, visual art, dance, and education.',
      DATE '2027-08-01', DATE '2027-09-01', 8, 'month', true,
      'Recent editions took place in late summer; 2027 dates have not been published.',
      'Cavtat', 'https://epidaurusfestival.com/program/'
    ),
    (
      'ston', 'Ston Oyster Festival', 'festival',
      'Local oyster, food, and wine festival with Dalmatian music and local products.',
      DATE '2027-03-01', NULL, 3, 'month', true,
      'Traditionally held in March; the 2027 date has not been published.',
      'Ston', 'https://www.ston.hr/?u=oyster-festival%2Fen%2Fdo%2F158%2F217'
    ),
    (
      'brac', 'Bol Cultural Events', 'festival',
      'Seasonal cultural programme in Bol on the island of Brač.',
      DATE '2027-06-01', DATE '2027-10-01', 6, 'month', true,
      'The events calendar describes a June–October season; specific 2027 listings are not yet published.',
      'Bol, Brač', 'https://bol.hr/en/events/'
    ),
    (
      'mljet', 'Noć vina (Wine Night)', 'festival',
      'August wine and food event in Pomena described by the Mljet Tourist Board.',
      DATE '2027-08-01', NULL, 8, 'month', true,
      'The Tourist Board describes this as an annual August event; the 2027 date has not been published.',
      'Pomena, Mljet', 'https://www.mljet.hr/?u=dogadanja/hr/do/3'
    ),
    (
      'rijeka', 'Rijeka Carnival Queen Selection and City-Key Handover', 'festival',
      'Carnival opening event with performances and the Queen selection.',
      DATE '2027-01-22', NULL, 1, 'day', false,
      'The official Rijeka Carnival index lists 22 January 2027.',
      'Rijeka', 'https://visitrijeka.hr/rijecki-karneval'
    ),
    (
      'rijeka', 'Children’s Carnival Parade', 'festival',
      'Carnival parade featuring children and young participants.',
      DATE '2027-01-30', NULL, 1, 'day', false,
      'The official Rijeka Carnival index lists 30 January 2027.',
      'Rijeka', 'https://visitrijeka.hr/rijecki-karneval'
    ),
    (
      'rijeka', 'International Carnival Parade', 'festival',
      'Large masked parade and the culmination of Rijeka Carnival.',
      DATE '2027-02-07', NULL, 2, 'day', false,
      'The official Rijeka Carnival index lists 7 February 2027.',
      'Rijeka', 'https://visitrijeka.hr/rijecki-karneval'
    ),
    (
      'crikvenica', 'Strawberry Festival', 'festival',
      'Seasonal food festival listed by the Crikvenica Riviera tourism board.',
      DATE '2027-03-01', DATE '2027-05-01', 3, 'month', true,
      'Held in spring; exact month and 2027 dates have not been published.',
      'Crikvenica Riviera', 'https://www.rivieracrikvenica.com/en/events'
    ),
    (
      'crikvenica', 'Cherry Festival', 'festival',
      'Seasonal food festival listed by the Crikvenica Riviera tourism board.',
      DATE '2027-03-01', DATE '2027-05-01', 3, 'month', true,
      'Held in spring; exact month and 2027 dates have not been published.',
      'Crikvenica Riviera', 'https://www.rivieracrikvenica.com/en/events'
    ),
    (
      'crikvenica', 'Fishermen’s Week (Ribarski tjedan)', 'festival',
      'Late-summer food and cultural programme with performances, workshops, concerts, and sporting activities.',
      DATE '2027-08-01', NULL, 8, 'month', true,
      'Usually held in late August; 2027 dates have not been published.',
      'Crikvenica', 'https://www.rivieracrikvenica.com/en/events'
    ),
    (
      'krk', 'Advent in Krk', 'festival',
      'Seasonal market with food and local products.',
      DATE '2026-11-29', DATE '2026-12-31', 11, 'day', false,
      'The official tourism-board announcement lists the 2026 dates; no 2027 schedule was found.',
      'Krk', 'https://visitkrk.city/post/advent-u-krku-2026-objavljen-javni-poziv-za-zakup-sajamskih-kucica-za-ugostiteljstvo'
    ),
    (
      'losinj', 'Lošinj Cup – Optimist Regatta', 'sport',
      'Youth sailing regatta, listed as the 27th edition.',
      DATE '2026-10-29', DATE '2026-11-01', 10, 'day', false,
      'The official tourism site lists the 2026 event dates; no 2027 schedule was found.',
      'Mali Lošinj', 'https://www.visitlosinj.hr/'
    ),
    (
      'rab', 'Rabska Fjera', 'festival',
      'Medieval-themed town festival with craft demonstrations, music, food, and a crossbowmen’s tournament.',
      DATE '2027-07-01', NULL, 7, 'month', true,
      'Held annually around the town’s patron-saint feast days; the 2027 programme has not been published.',
      'Rab Town', 'https://www.rab-visit.com/en/what-to-do/upcoming/rabska-fjera-195/195'
    )
)
INSERT INTO venue_events (
  city_id, venue_id, title, event_type, description, start_date, end_date,
  start_month, date_precision, is_recurring, schedule_note, event_venue, source_url
)
SELECT
  c.id, NULL, e.title, e.event_type, e.description, e.start_date, e.end_date,
  e.start_month, e.date_precision, e.is_recurring, e.schedule_note, e.event_venue, e.source_url
FROM event_seed e
JOIN cities c ON c.slug = e.city_slug
WHERE NOT EXISTS (
  SELECT 1
  FROM venue_events existing
  WHERE existing.city_id = c.id
    AND existing.title = e.title
    AND existing.start_date = e.start_date
);
