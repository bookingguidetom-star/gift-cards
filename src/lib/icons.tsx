import {
  Utensils,
  BedDouble,
  Flower2,
  ShoppingBag,
  Trees,
  Sailboat,
  Wine,
  Landmark,
  Car,
  Martini,
  type LucideIcon,
} from 'lucide-react';
import type { VenueCategory } from './types';

const ICON_MAP: Record<VenueCategory, LucideIcon> = {
  restaurant: Utensils,
  hotel: BedDouble,
  wellness: Flower2,
  shop: ShoppingBag,
  park: Trees,
  boat: Sailboat,
  winery: Wine,
  culture: Landmark,
  taxi: Car,
  nightlife: Martini,
};

export function CategoryIcon({
  category,
  className,
}: {
  category: VenueCategory;
  className?: string;
}) {
  const Icon = ICON_MAP[category];
  return <Icon className={className} />;
}
