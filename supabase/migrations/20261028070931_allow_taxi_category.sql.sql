/*
# Add 'taxi' to allowed venue categories

1. Purpose
- The venues table has a CHECK constraint (venues_category_check) that restricts
  the category column to a fixed set of values. Add 'taxi' to that allowlist so
  taxi services can be inserted as venues.

2. Changes
- Drop the existing venues_category_check constraint.
- Recreate it with the original values plus 'taxi'.

3. Security
- No RLS or grant changes — this only widens the allowed category enum.
*/

ALTER TABLE venues DROP CONSTRAINT IF EXISTS venues_category_check;

ALTER TABLE venues
  ADD CONSTRAINT venues_category_check
  CHECK (category IN ('restaurant','hotel','wellness','shop','park','boat','winery','culture','taxi'));
