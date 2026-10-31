-- Update the venues category check to include 'culture'
ALTER TABLE venues DROP CONSTRAINT IF EXISTS venues_category_check;
ALTER TABLE venues ADD CONSTRAINT venues_category_check
  CHECK (category = ANY (ARRAY['restaurant'::text, 'hotel'::text, 'wellness'::text, 'shop'::text, 'park'::text, 'boat'::text, 'winery'::text, 'culture'::text]));
