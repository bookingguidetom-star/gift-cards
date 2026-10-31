# Croatia Gift Cards — app-builder handoff

Use this file as the project brief if you open the repository in an AI app builder or hand it to another coding assistant. Work from the existing code; do not replace the app with a fresh template.

## What this app is

Croatia Gift Cards is a React + TypeScript + Vite app backed by Supabase. It presents Croatian destinations and experience venues, lets visitors browse categories, and has gift-card and hotel-booking flows.

## Work already added

- Added six coastal destinations in `supabase/migrations/20261030050000_add_adriatic_destinations_and_experiences.sql`: Umag, Novigrad, Biograd na Moru, Primošten, Crikvenica, and Vodice.
- Added `source_url` columns for cities and venues. City pages and venue cards link to those sources.
- Added coastal activity listings for Biograd, Primošten, Crikvenica, and Rab.
- Added a `nightlife` venue category, displayed as **Bars & Nightlife**, with initial listings for each of the six new coastal destinations.
- Added direct venue listings with official business sites for Aurora Club in Primošten and Sabbia beach bar in Crikvenica. For Umag, Novigrad, Biograd, and Vodice, the listings point to tourism-board guides for waterfront areas rather than claiming specific bars have been independently verified.
- Updated the destination count in the city list and several home-page labels so they no longer hard-code the previous count.
- Nightlife entries with unknown prices say “Check details,” not “Free entry.”

The original city seed has 20 destinations; another migration adds six islands; this work adds six coastal destinations. If all relevant migrations are applied, the catalog contains **32 destinations**. Treat the database as authoritative and avoid hard-coding that count.

## Verified public references

- Umag, Istria Tourist Board: <https://www.istra.hr/en/destinations/umag>
- Novigrad, Istria Tourist Board: <https://www.istra.hr/en/destinations/novigrad>
- Biograd na Moru, official destination site: <https://www.discover-biograd.com/en>
- Primošten, official destination site: <https://visitprimosten.com/en/>
- Crikvenica Riviera, official tourism site: <https://www.rivieracrikvenica.com/en>
- Vodice, Tourist Board: <https://www.vodice.hr/en>
- Rab sailing information, official destination site: <https://www.rab-visit.com/en/what-to-do/sailing/106>
- Aurora Club, Primošten: <https://auroraclub.hr/>
- Sabbia beach bar, Crikvenica: <https://www.sabbia.hr/>
- Mali Lošinj Tourist Board: <https://www.visitlosinj.hr/>
- Blue World Institute (marine conservation/research): <https://www.blue-world.org/>

Source links are for visitor information, not a guarantee of current opening hours, availability, ratings, or prices. Confirm seasonal business details before presenting them as current facts.

## Important outstanding requests

These earlier user requests have **not** been completed yet:

1. Reach ten distinct hotels per city, adding only what is missing (not ten on top of existing records).
2. Reach ten distinct wellness venues per city.
3. Reach ten distinct theatres and ten distinct cinemas per city.
4. Find and add specific verified bars and hangout venues for the coastal destinations. Current waterfront-area recommendations for four cities are general destination-guide entries, not individually verified named bars.
5. Continue finding real boat tours or other excursions around the Adriatic coast and link each listing to a reliable source.

Before adding more seed data, audit all existing migrations and counts by city and venue type. Existing hotel migrations appear to contain placeholder-like descriptions, repeated stock imagery, and ratings/prices without per-venue sources. Do not treat those records as verified just because they exist, and do not duplicate them. Theatre and cinema should be distinguishable using `venue_type` under the existing `culture` category unless a deliberate schema change is justified.

## Project files to start with

- `src/lib/types.ts` — city, venue, and category types/metadata.
- `src/lib/icons.tsx` — category icons.
- `src/pages/CityDetailPage.tsx` — destination page and category filters.
- `src/pages/CitiesPage.tsx` and `src/components/CityCard.tsx` — destination listing.
- `src/components/VenueCard.tsx` — venue card and source-link rendering.
- `src/lib/queries.ts` — Supabase catalog queries.
- `supabase/migrations/20261025060407_seed_cities.sql` — original 20 destinations.
- `supabase/migrations/20261025062222_add_croatian_islands.sql.sql` — six island destinations.
- `supabase/migrations/20261030050000_add_adriatic_destinations_and_experiences.sql` — recent coastal destinations and activities.
- `supabase/migrations/20261030060000_add_nightlife_category.sql` — Bars & Nightlife category and seed entries.

## Development and verification

From the repository root, install dependencies with `npm install`, configure the app’s Supabase environment variables, then run `npm run dev`. Available checks in `package.json` are `npm run typecheck`, `npm run lint`, and `npm run build`.

At the time this handoff was written, Node.js/npm were not available in the coding environment, and those checks and a live app preview had not been run. Apply the Supabase migrations to the intended project before expecting the newly seeded records to appear in the app.
