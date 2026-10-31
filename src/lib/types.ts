export type VenueCategory =
  | 'restaurant'
  | 'hotel'
  | 'wellness'
  | 'shop'
  | 'park'
  | 'boat'
  | 'winery'
  | 'culture'
  | 'taxi'
  | 'nightlife';

export interface Specialty {
  name: string;
  type: string;
  desc: string;
}

export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  short_description: string;
  long_description: string;
  image_url: string;
  lat: number;
  lng: number;
  specialties: Specialty[] | null;
  source_url?: string | null;
}

export interface Venue {
  id: string;
  city_id: string;
  name: string;
  category: VenueCategory;
  description: string;
  rating: number | null;
  price_from_eur: number | null;
  image_url: string;
  address: string | null;
  source: string | null;
  featured: boolean;
  source_url?: string | null;
  website_url?: string | null;
  external_url?: string | null;
  external_label?: string | null;
  venue_type?: string | null;
}

export type GiftCardStatus =
  | 'pending'
  | 'sent'
  | 'partially_redeemed'
  | 'redeemed'
  | 'expired';

export interface GiftCard {
  id: string;
  code: string;
  amount_eur: number;
  balance_eur: number;
  recipient_name: string;
  recipient_email: string;
  buyer_name: string | null;
  buyer_email: string | null;
  personal_message: string | null;
  delivery_date: string | null;
  status: GiftCardStatus;
  selected_venue_ids: string[];
  created_at: string;
}

export interface VenueEvent {
  id: string;
  venue_id: string;
  title: string;
  event_type: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  start_month: number;
  is_recurring: boolean;
  schedule_note: string | null;
  ticket_url: string | null;
  price_range: string | null;
}

export interface CityWithVenues extends City {
  venues: Venue[];
  events?: VenueEvent[];
}

export type HotelBookingStatus = 'confirmed' | 'cancelled';

export interface HotelBooking {
  id: string;
  venue_id: string;
  guest_name: string;
  guest_email: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: HotelBookingStatus;
  reference: string;
  total_eur: number;
  special_requests: string | null;
  created_at: string;
}

export interface VenueWithCity extends Venue {
  city_name: string;
  city_slug: string;
}

export const CATEGORY_META: Record<
  VenueCategory,
  { label: string; shortLabel: string; blurb: string; icon: string }
> = {
  restaurant: {
    label: 'Restaurants',
    shortLabel: 'Dining',
    blurb: 'TripAdvisor-rated tables from seafront taverns to Michelin stars.',
    icon: 'Utensils',
  },
  hotel: {
    label: 'Hotels & Stays',
    shortLabel: 'Hotels',
    blurb: 'Cliffside suites, boutique palaces, and sea-view rooms.',
    icon: 'BedDouble',
  },
  wellness: {
    label: 'Wellness & Spa',
    shortLabel: 'Spa',
    blurb: 'Thermal pools, sea-salt rituals, and pine-forest retreats.',
    icon: 'Flower2',
  },
  shop: {
    label: 'Shops & Markets',
    shortLabel: 'Shops',
    blurb: 'Truffle markets, olive oil, lace, and Croatian artisan crafts.',
    icon: 'ShoppingBag',
  },
  park: {
    label: 'Parks & Nature',
    shortLabel: 'Parks',
    blurb: 'Plitvice lakes, national parks, medieval walls, and promenades.',
    icon: 'Trees',
  },
  boat: {
    label: 'Boat Excursions',
    shortLabel: 'Boat',
    blurb: 'Blue Cave sails, island-hopping, and private skippered days.',
    icon: 'Sailboat',
  },
  winery: {
    label: 'Wine & Tastings',
    shortLabel: 'Wine',
    blurb: 'Plavac Mali, Pošip, Malvazija — cellar tastings and vineyard tours.',
    icon: 'Wine',
  },
  culture: {
    label: 'Museums, Theatres & Cinemas',
    shortLabel: 'Culture',
    blurb: 'Museums, theatres, cinemas, galleries, and festivals across Croatia.',
    icon: 'Landmark',
  },
  taxi: {
    label: 'Taxis & Transfers',
    shortLabel: 'Taxi',
    blurb: 'Airport transfers, city taxis, and private drivers across Croatia.',
    icon: 'Car',
  },
  nightlife: {
    label: 'Bars & Nightlife',
    shortLabel: 'Nightlife',
    blurb: 'Beach bars, waterfront cafés, cocktail spots, and seasonal clubs.',
    icon: 'Martini',
  },
};

export const CATEGORY_ORDER: VenueCategory[] = [
  'restaurant',
  'hotel',
  'wellness',
  'boat',
  'winery',
  'park',
  'shop',
  'culture',
  'taxi',
  'nightlife',
];
