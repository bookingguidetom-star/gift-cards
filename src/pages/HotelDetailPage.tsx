import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Star,
  Euro,
  MapPin,
  Calendar,
  Users,
  Check,
  BedDouble,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { fetchVenueWithCity } from '@/lib/queries';
import { fetchVenueEventsByVenueId } from '@/lib/queries';
import { formatEuro, formatRating, generateBookingReference } from '@/lib/format';
import { CATEGORY_META } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import { Link, useRouter } from '@/lib/router';
import type { VenueEvent, HotelBooking } from '@/lib/types';

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

function tomorrowISO(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split('T')[0];
}

function nightsBetween(checkIn: string, checkOut: string): number {
  const a = new Date(checkIn + 'T00:00:00');
  const b = new Date(checkOut + 'T00:00:00');
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HotelDetailPage({ venueId }: { venueId: string }) {
  const { navigate } = useRouter();
  const venue = useAsync(() => fetchVenueWithCity(venueId), [venueId]);
  const eventsHook = useAsync(() => fetchVenueEventsByVenueId(venueId), [venueId]);

  const [checkIn, setCheckIn] = useState(todayISO());
  const [checkOut, setCheckOut] = useState(tomorrowISO());
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<HotelBooking | null>(null);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.max(0, nightsBetween(checkIn, checkOut));
  }, [checkIn, checkOut]);

  const pricePerNight = venue.data?.price_from_eur ?? 0;
  const total = useMemo(() => nights * pricePerNight, [nights, pricePerNight]);

  const canBook = useMemo(() => {
    return (
      nights > 0 &&
      guestName.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(guestEmail) &&
      !submitting
    );
  }, [nights, guestName, guestEmail, submitting]);

  const submit = async () => {
    if (!canBook || !venue.data) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const reference = generateBookingReference();
      const { data, error } = await supabase
        .from('hotel_bookings')
        .insert({
          venue_id: venue.data.id,
          guest_name: guestName.trim(),
          guest_email: guestEmail.trim(),
          check_in: checkIn,
          check_out: checkOut,
          guests,
          status: 'confirmed',
          reference,
          total_eur: total,
          special_requests: specialRequests.trim() || null,
        })
        .select()
        .single();
      if (error) throw error;
      setConfirmedBooking(data as HotelBooking);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not complete the booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (venue.loading) {
    return (
      <div className="pt-32 container-page">
        <div className="h-8 w-40 animate-pulse rounded-xl bg-sea-100" />
        <div className="mt-6 aspect-[21/9] animate-pulse rounded-3xl bg-sea-100" />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 h-96 animate-pulse rounded-2xl bg-sea-100" />
          <div className="h-96 animate-pulse rounded-2xl bg-sea-100" />
        </div>
      </div>
    );
  }

  if (venue.error || !venue.data) {
    return (
      <div className="pt-32 container-page">
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-12 text-center">
          <p className="text-terracotta-800">{venue.error ?? 'Hotel not found.'}</p>
          <button onClick={() => navigate('/cities')} className="btn-ghost mt-6">
            Browse cities
          </button>
        </div>
      </div>
    );
  }

  const v = venue.data;
  const meta = CATEGORY_META[v.category];

  if (confirmedBooking) {
    return <BookingConfirmation booking={confirmedBooking} hotelName={v.name} cityName={v.city_name} citySlug={v.city_slug} />;
  }

  const events: VenueEvent[] = eventsHook.data ?? [];

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <section className="container-page mt-6">
        <Link to={`/city/${v.city_slug}`} className="inline-flex items-center gap-2 text-sm text-sea-500 hover:text-sea-800">
          <ArrowLeft className="h-4 w-4" /> {v.city_name}
        </Link>
      </section>

      {/* Hero image */}
      <section className="container-page mt-4">
        <div className="relative overflow-hidden rounded-3xl">
          <div className="aspect-[21/9] w-full">
            <img src={v.image_url} alt={v.name} className="h-full w-full object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-sea-950/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
            <span className="chip border border-white/30 bg-white/15 text-white backdrop-blur-sm">
              <CategoryIcon category={v.category} className="h-3.5 w-3.5" /> {meta.shortLabel}
            </span>
            <h1 className="mt-3 font-display text-4xl font-semibold text-white sm:text-5xl">{v.name}</h1>
            {v.address && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/90">
                <MapPin className="h-4 w-4" /> {v.address}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-page mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left: info */}
        <div className="lg:col-span-2">
          {/* Key facts */}
          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-sea-100 bg-white p-5 shadow-soft">
            {v.rating !== null && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sand-100 px-3 py-1.5 text-sm font-bold text-sand-800">
                <Star className="h-3.5 w-3.5 fill-sand-700 text-sand-700" /> {formatRating(v.rating)}
              </span>
            )}
            {v.price_from_eur !== null && v.price_from_eur > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sea-50 px-3 py-1.5 text-sm font-semibold text-sea-700">
                <Euro className="h-3.5 w-3.5" /> from {formatEuro(v.price_from_eur)}/night
              </span>
            )}
            {v.featured && (
              <span className="chip bg-terracotta-500 text-white">
                <Sparkles className="h-3 w-3" /> Featured
              </span>
            )}
            {v.source && <span className="text-sm text-sea-400">via {v.source}</span>}
          </div>

          {/* Description */}
          <div className="mt-6 rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-2xl font-semibold text-sea-950">About this hotel</h2>
            <p className="mt-3 text-base leading-relaxed text-sea-600">{v.description}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-sea-50 px-4 py-3 text-sm text-sea-700">
                <BedDouble className="h-4 w-4 text-sea-500" /> Comfortable rooms
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-sea-50 px-4 py-3 text-sm text-sea-700">
                <Calendar className="h-4 w-4 text-sea-500" /> Free date selection
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-sea-50 px-4 py-3 text-sm text-sea-700">
                <Check className="h-4 w-4 text-sea-500" /> Instant confirmation
              </div>
            </div>
            {v.external_url && (
              <a
                href={v.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
              >
                Visit hotel website <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>

          {/* Events at this venue */}
          {events.length > 0 && (
            <div className="mt-6 rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-sea-950">Events here</h2>
              <div className="mt-4 space-y-3">
                {events.slice(0, 5).map((e) => (
                  <div key={e.id} className="flex items-start gap-3 rounded-xl border border-sea-50 p-3">
                    <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-terracotta-500" />
                    <div>
                      <p className="text-sm font-semibold text-sea-950">{e.title}</p>
                      <p className="text-xs text-sea-500">
                        {new Date(e.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        {e.end_date && ` – ${new Date(e.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                        {e.schedule_note && ` · ${e.schedule_note}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: booking widget */}
        <aside>
          <div className="sticky top-24">
            <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-soft">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="font-display text-3xl font-semibold text-sea-950">
                    {formatEuro(pricePerNight)}
                  </span>
                  <span className="text-sm text-sea-500"> / night</span>
                </div>
                {v.rating !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-bold text-sand-800">
                    <Star className="h-3 w-3 fill-sand-700 text-sand-700" /> {formatRating(v.rating)}
                  </span>
                )}
              </div>

              {/* Dates */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <BookingField label="Check-in">
                  <input
                    type="date"
                    value={checkIn}
                    min={todayISO()}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) {
                        const next = new Date(e.target.value + 'T00:00:00');
                        next.setDate(next.getDate() + 1);
                        setCheckOut(next.toISOString().split('T')[0]);
                      }
                    }}
                    className="input-field px-3 py-2.5 text-sm"
                  />
                </BookingField>
                <BookingField label="Check-out">
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="input-field px-3 py-2.5 text-sm"
                  />
                </BookingField>
              </div>

              {/* Guests */}
              <BookingField label="Guests" className="mt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(1, g - 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sea-200 text-sea-700 transition-colors hover:border-sea-400 hover:bg-sea-50"
                    aria-label="Fewer guests"
                  >
                    –
                  </button>
                  <div className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-sea-200 bg-ivory-50 px-3 py-2 text-sm font-semibold text-sea-800">
                    <Users className="h-4 w-4 text-sea-500" />
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </div>
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(10, g + 1))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sea-200 text-sea-700 transition-colors hover:border-sea-400 hover:bg-sea-50"
                    aria-label="More guests"
                  >
                    +
                  </button>
                </div>
              </BookingField>

              {/* Price summary */}
              {nights > 0 && (
                <div className="mt-5 space-y-2 border-t border-sea-100 pt-4 text-sm">
                  <div className="flex justify-between text-sea-600">
                    <span>{formatEuro(pricePerNight)} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                    <span className="font-medium text-sea-950">{formatEuro(total)}</span>
                  </div>
                  <div className="flex justify-between border-t border-sea-50 pt-2 text-base font-semibold text-sea-950">
                    <span>Total</span>
                    <span>{formatEuro(total)}</span>
                  </div>
                </div>
              )}

              {/* Guest details */}
              <div className="mt-5 space-y-3">
                <BookingField label="Full name">
                  <input
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="input-field px-3 py-2.5 text-sm"
                    placeholder="Ana Horvat"
                  />
                </BookingField>
                <BookingField label="Email">
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="input-field px-3 py-2.5 text-sm"
                    placeholder="ana@example.com"
                  />
                </BookingField>
                <BookingField label="Special requests">
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows={2}
                    className="input-field resize-none px-3 py-2.5 text-sm"
                    placeholder="Late check-in, sea view, etc."
                  />
                </BookingField>
              </div>

              {submitError && (
                <div className="mt-3 rounded-xl border border-terracotta-200 bg-terracotta-50 p-3 text-sm text-terracotta-800">
                  {submitError}
                </div>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={!canBook}
                className="btn-primary mt-5 w-full"
              >
                {submitting ? 'Booking...' : `Book for ${formatEuro(total)}`}
                {!submitting && <ArrowRight className="h-4 w-4" />}
              </button>
              <p className="mt-2 text-center text-xs text-sea-400">
                Free confirmation · No payment required to reserve
              </p>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

function BookingField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-semibold uppercase tracking-wider text-sea-500">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function BookingConfirmation({
  booking,
  hotelName,
  cityName,
  citySlug,
}: {
  booking: HotelBooking;
  hotelName: string;
  cityName: string;
  citySlug: string;
}) {
  const nights = nightsBetween(booking.check_in, booking.check_out);
  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-600">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-sea-950">Booking confirmed</h1>
          <p className="mt-2 text-sea-600">
            Your room at {hotelName} in {cityName} is reserved. A confirmation has been sent to {booking.guest_email}.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-soft">
          <div className="bg-gradient-to-br from-sea-600 to-sea-900 p-6 text-white">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <BedDouble className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Booking reference</span>
            </div>
            <p className="mt-4 font-mono text-2xl tracking-[0.2em]">{booking.reference}</p>
          </div>
          <div className="p-6">
            <dl className="space-y-3 text-sm">
              <ConfRow label="Hotel" value={hotelName} />
              <ConfRow label="City" value={cityName} />
              <ConfRow label="Guest" value={`${booking.guest_name} · ${booking.guest_email}`} />
              <ConfRow label="Check-in" value={new Date(booking.check_in).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} />
              <ConfRow label="Check-out" value={new Date(booking.check_out).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} />
              <ConfRow label="Length" value={`${nights} ${nights === 1 ? 'night' : 'nights'}, ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`} />
              {booking.special_requests && <ConfRow label="Requests" value={booking.special_requests} />}
              <div className="flex justify-between border-t border-sea-100 pt-3 text-base font-semibold text-sea-950">
                <dt>Total paid</dt>
                <dd>{formatEuro(Number(booking.total_eur))}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-md justify-center gap-3">
          <Link to={`/city/${citySlug}`} className="btn-ghost">Back to {cityName}</Link>
          <Link to="/" className="btn-primary">Back home</Link>
        </div>
      </section>
    </div>
  );
}

function ConfRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-sea-50 pb-2">
      <dt className="text-sea-500">{label}</dt>
      <dd className="text-right font-medium text-sea-950">{value}</dd>
    </div>
  );
}
