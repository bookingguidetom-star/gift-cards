/*
# Map all cities to their official Croatian counties (21 regions)

1. Purpose
- Replace the broad, informal region labels (Dalmatia, Istria, Kvarner, etc.)
  with the 21 official administrative regions of Croatia:
  20 counties (županije) + the City of Zagreb.
- This lets the Cart page show all 21 regions with cities grouped correctly.

2. Changes
- UPDATE cities SET region = ... for all 26 cities.
- No schema or RLS changes.

3. Mapping (city → official county)
  Zagreb           → City of Zagreb
  Osijek           → Osijek-Baranja County
  Varaždin         → Varaždin County
  Rovinj           → Istria County
  Poreč            → Istria County
  Pula             → Istria County
  Motovun          → Istria County
  Rijeka           → Primorje-Gorski Kotar County
  Krk              → Primorje-Gorski Kotar County
  Lošinj           → Primorje-Gorski Kotar County
  Rab              → Primorje-Gorski Kotar County
  Pag              → Lika-Senj County
  Opatija          → Primorje-Gorski Kotar County
  Zadar            → Zadar County
  Split            → Split-Dalmatia County
  Šibenik          → Šibenik-Knin County
  Trogir           → Split-Dalmatia County
  Makarska         → Split-Dalmatia County
  Brač             → Split-Dalmatia County
  Hvar             → Split-Dalmatia County
  Vis              → Split-Dalmatia County
  Dubrovnik        → Dubrovnik-Neretva County
  Cavtat           → Dubrovnik-Neretva County
  Korčula          → Dubrovnik-Neretva County
  Ston             → Dubrovnik-Neretva County
  Mljet            → Dubrovnik-Neretva County
*/

UPDATE cities SET region = 'City of Zagreb' WHERE slug = 'zagreb';
UPDATE cities SET region = 'Osijek-Baranja County' WHERE slug = 'osijek';
UPDATE cities SET region = 'Varaždin County' WHERE slug = 'varazdin';
UPDATE cities SET region = 'Istria County' WHERE slug = 'rovinj';
UPDATE cities SET region = 'Istria County' WHERE slug = 'porec';
UPDATE cities SET region = 'Istria County' WHERE slug = 'pula';
UPDATE cities SET region = 'Istria County' WHERE slug = 'motovun';
UPDATE cities SET region = 'Primorje-Gorski Kotar County' WHERE slug = 'rijeka';
UPDATE cities SET region = 'Primorje-Gorski Kotar County' WHERE slug = 'krk';
UPDATE cities SET region = 'Primorje-Gorski Kotar County' WHERE slug = 'losinj';
UPDATE cities SET region = 'Primorje-Gorski Kotar County' WHERE slug = 'rab';
UPDATE cities SET region = 'Primorje-Gorski Kotar County' WHERE slug = 'opatija';
UPDATE cities SET region = 'Lika-Senj County' WHERE slug = 'pag';
UPDATE cities SET region = 'Zadar County' WHERE slug = 'zadar';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'split';
UPDATE cities SET region = 'Šibenik-Knin County' WHERE slug = 'sibenik';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'trogir';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'makarska';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'brac';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'hvar';
UPDATE cities SET region = 'Split-Dalmatia County' WHERE slug = 'vis';
UPDATE cities SET region = 'Dubrovnik-Neretva County' WHERE slug = 'dubrovnik';
UPDATE cities SET region = 'Dubrovnik-Neretva County' WHERE slug = 'cavtat';
UPDATE cities SET region = 'Dubrovnik-Neretva County' WHERE slug = 'korcula';
UPDATE cities SET region = 'Dubrovnik-Neretva County' WHERE slug = 'ston';
UPDATE cities SET region = 'Dubrovnik-Neretva County' WHERE slug = 'mljet';
