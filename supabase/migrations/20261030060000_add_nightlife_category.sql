ALTER TABLE venues DROP CONSTRAINT IF EXISTS venues_category_check;
ALTER TABLE venues ADD CONSTRAINT venues_category_check
  CHECK (category IN (
    'restaurant', 'hotel', 'wellness', 'shop', 'park', 'boat', 'winery',
    'culture', 'taxi', 'nightlife'
  ));

INSERT INTO venues (
  city_id, name, category, description, rating, price_from_eur, image_url,
  address, source, featured, source_url, venue_type
)
SELECT c.id, v.name, 'nightlife', v.description, NULL, NULL, v.image_url,
  NULL, v.source, false, v.source_url, v.venue_type
FROM (
  VALUES
    (
      'umag',
      'Umag waterfront cafés & bars',
      'Explore the town’s waterfront and historic centre for local cafés and bars. Use the Istria tourism guide for destination information.',
      'Istria Tourist Board',
      'https://www.istra.hr/en/destinations/umag',
      'waterfront_hangout',
      'https://images.pexels.com/photos/27401067/pexels-photo-27401067.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ),
    (
      'novigrad',
      'Novigrad harbour cafés & bars',
      'Explore the harbour and historic centre for local cafés and bars. The Istria tourism guide covers the town and visitor information.',
      'Istria Tourist Board',
      'https://www.istra.hr/en/destinations/novigrad',
      'waterfront_hangout',
      'https://images.pexels.com/photos/27507354/pexels-photo-27507354.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ),
    (
      'biograd-na-moru',
      'Biograd waterfront & marina cafés',
      'Explore the waterfront and marina area for cafés and relaxed seaside stops. Consult the official Biograd destination guide for current visitor information.',
      'Biograd Tourist Board',
      'https://www.discover-biograd.com/en',
      'waterfront_hangout',
      'https://images.pexels.com/photos/33581260/pexels-photo-33581260.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ),
    (
      'primosten',
      'Aurora Club',
      'A seasonal club on the hills above Primošten, with bars, a cocktail area, lounge, and outdoor dance spaces. Check its official site for the current season and programme.',
      'Aurora Club',
      'https://auroraclub.hr/',
      'nightclub',
      'https://images.pexels.com/photos/34592239/pexels-photo-34592239.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ),
    (
      'crikvenica',
      'Sabbia beach bar',
      'A beachside restaurant, pizzeria, and bar with coffee, cocktails, and evening entertainment. Visit the venue site for current opening hours and events.',
      'Sabbia',
      'https://www.sabbia.hr/',
      'beach_bar',
      'https://images.pexels.com/photos/29674356/pexels-photo-29674356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    ),
    (
      'vodice',
      'Vodice waterfront cafés & bars',
      'Explore the seafront and town centre for cafés and bars. Check the official Vodice tourist board for local visitor information and seasonal events.',
      'Vodice Tourist Board',
      'https://www.vodice.hr/en',
      'waterfront_hangout',
      'https://images.pexels.com/photos/17563088/pexels-photo-17563088.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
    )
) AS v(city_slug, name, description, source, source_url, venue_type, image_url)
JOIN cities c ON c.slug = v.city_slug
WHERE NOT EXISTS (
  SELECT 1 FROM venues existing
  WHERE existing.city_id = c.id AND lower(existing.name) = lower(v.name)
);
