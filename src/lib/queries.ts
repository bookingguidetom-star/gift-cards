import { supabase } from './supabase';
import type { City, CityWithVenues, Venue, VenueCategory, VenueEvent, VenueWithCity } from './types';

export async function fetchCities(): Promise<City[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCityBySlug(slug: string): Promise<City | null> {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchCityWithVenues(slug: string): Promise<CityWithVenues | null> {
  const city = await fetchCityBySlug(slug);
  if (!city) return null;
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('city_id', city.id)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false });
  if (error) throw error;
  const events = await fetchEventsByCityId(city.id);
  return { ...city, venues: data ?? [], events };
}

export async function fetchFeaturedVenues(limit = 6): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('featured', true)
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchVenuesByCategory(
  category: VenueCategory,
  limit = 24,
): Promise<Venue[]> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('category', category)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function fetchVenuesByIds(ids: string[]): Promise<Venue[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .in('id', ids);
  if (error) throw error;
  return data ?? [];
}

export interface CalendarEvent extends VenueEvent {
  venue_name: string;
  city_id: string;
  city_name: string;
  city_slug: string;
}

export async function fetchEventsCalendarData(): Promise<CalendarEvent[]> {
  const [eventsRes, venuesRes, citiesRes] = await Promise.all([
    supabase.from('venue_events').select('*'),
    supabase.from('venues').select('id, name, city_id'),
    supabase.from('cities').select('id, name, slug'),
  ]);
  if (eventsRes.error) throw eventsRes.error;
  if (venuesRes.error) throw venuesRes.error;
  if (citiesRes.error) throw citiesRes.error;
  const events = eventsRes.data ?? [];
  const venueMap = new Map((venuesRes.data ?? []).map((v) => [v.id, v]));
  const cityMap = new Map((citiesRes.data ?? []).map((c) => [c.id, c]));
  return events.map((e) => {
    const venue = venueMap.get(e.venue_id);
    const city = venue ? cityMap.get(venue.city_id) : undefined;
    return {
      ...e,
      venue_name: venue?.name ?? 'Unknown venue',
      city_id: venue?.city_id ?? '',
      city_name: city?.name ?? '',
      city_slug: city?.slug ?? '',
    } as CalendarEvent;
  });
}

export async function fetchEventsByCityId(cityId: string): Promise<VenueEvent[]> {
  const { data: venues } = await supabase
    .from('venues')
    .select('id')
    .eq('city_id', cityId);
  if (!venues || venues.length === 0) return [];
  const venueIds = venues.map((v) => v.id);
  const { data, error } = await supabase
    .from('venue_events')
    .select('*')
    .in('venue_id', venueIds)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchVenueEventsByVenueId(venueId: string): Promise<VenueEvent[]> {
  const { data, error } = await supabase
    .from('venue_events')
    .select('*')
    .eq('venue_id', venueId)
    .order('start_date', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchVenueWithCity(venueId: string): Promise<VenueWithCity | null> {
  const { data: venue, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .maybeSingle();
  if (error) throw error;
  if (!venue) return null;
  const { data: city, error: cityError } = await supabase
    .from('cities')
    .select('id, name, slug')
    .eq('id', venue.city_id)
    .maybeSingle();
  if (cityError) throw cityError;
  return { ...venue, city_name: city?.name ?? '', city_slug: city?.slug ?? '' };
}
