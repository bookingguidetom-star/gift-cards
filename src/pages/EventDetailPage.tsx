import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  ExternalLink,
  MapPin,
  Repeat,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchEventById } from '@/lib/queries';
import { Link } from '@/lib/router';
import { formatEuro } from '@/lib/format';
import { eventPriceFrom, eventTypeMeta, formatEventDates } from '@/lib/events';

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const { data: event, loading, error } = useAsync(() => fetchEventById(eventId), [eventId]);

  if (loading) {
    return (
      <div className="pt-32 container-page">
        <div className="h-5 w-28 animate-pulse rounded-full bg-sea-100" />
        <div className="mt-6 h-12 w-2/3 animate-pulse rounded-xl bg-sea-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div className="h-72 animate-pulse rounded-3xl bg-sea-100" />
          <div className="h-72 animate-pulse rounded-3xl bg-sea-100" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="pt-32 container-page">
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-12 text-center">
          <p className="text-terracotta-800">{error ?? 'This event could not be found.'}</p>
          <Link to="/events" className="btn-ghost mt-6">
            <ArrowLeft className="h-4 w-4" /> Back to the calendar
          </Link>
        </div>
      </div>
    );
  }

  const meta = eventTypeMeta(event.event_type);
  const Icon = meta.icon;
  const price = eventPriceFrom(event);
  const isFree = price === 0;

  return (
    <div className="pb-16 pt-24">
      <section className="container-page">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sea-600 transition-colors hover:text-sea-900"
        >
          <ArrowLeft className="h-4 w-4" /> All events
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.55fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${meta.color}`}
              >
                <Icon className="h-3 w-3" />
                {meta.label}
              </span>
              {event.is_recurring && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-sea-500">
                  <Repeat className="h-3 w-3" /> Annual event
                </span>
              )}
              {event.date_precision === 'month' && (
                <span className="inline-flex items-center rounded-full bg-sand-100 px-3 py-1 text-[11px] font-semibold text-sand-800">
                  Dates to be confirmed
                </span>
              )}
            </div>

            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-sea-950 sm:text-5xl">
              {event.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-sea-600">
              <Link
                to={`/city/${event.city_slug}`}
                className="inline-flex items-center gap-1.5 font-medium transition-colors hover:text-sea-900"
              >
                <MapPin className="h-4 w-4" />
                {event.venue_name}, {event.city_name}
              </Link>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formatEventDates(event)}
              </span>
            </div>

            {event.schedule_note && (
              <div className="mt-2 flex items-start gap-1.5 text-sm text-sea-500">
                <Clock className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{event.schedule_note}</span>
              </div>
            )}

            <div className="mt-8 rounded-3xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-sea-950">About this event</h2>
              {event.description ? (
                <p className="mt-3 text-base leading-relaxed text-sea-600">{event.description}</p>
              ) : (
                <p className="mt-3 text-base leading-relaxed text-sea-500">
                  The organiser has not published a full description for this listing yet. Check back closer to the date
                  or contact the venue for programme details.
                </p>
              )}

              <dl className="mt-6 grid gap-5 border-t border-sea-50 pt-6 sm:grid-cols-3">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-sea-400">Date</dt>
                  <dd className="mt-1 text-sm font-medium text-sea-900">{formatEventDates(event)}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-sea-400">Venue</dt>
                  <dd className="mt-1 text-sm font-medium text-sea-900">{event.venue_name}</dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-sea-400">Destination</dt>
                  <dd className="mt-1 text-sm font-medium text-sea-900">
                    <Link to={`/city/${event.city_slug}`} className="hover:text-terracotta-600">
                      {event.city_name}
                    </Link>
                  </dd>
                </div>
              </dl>

              {(event.source_url || event.ticket_url) && (
                <div className="mt-6 flex flex-wrap gap-4 border-t border-sea-50 pt-5">
                  {event.source_url && (
                    <a
                      href={event.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sea-600 transition-colors hover:text-sea-800"
                    >
                      Official information <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  {event.ticket_url && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
                    >
                      Organiser's ticket page <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-sea-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Tickets</span>
            <p className="mt-2 font-display text-3xl font-semibold text-sea-950">
              {isFree ? 'Free entry' : formatEuro(price)}
              {!isFree && <span className="ml-1 font-sans text-sm font-medium text-sea-500">per ticket</span>}
            </p>
            <p className="mt-1 text-sm text-sea-500">
              {event.price_range ? `Published range: ${event.price_range}` : 'Indicative price for this mock booking'}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sea-600">
              Book your place at {event.title} in {event.city_name} and keep your booking reference in one place.
            </p>
            <Link to={`/checkout/event/${event.id}`} className="btn-primary mt-5 w-full">
              <Ticket className="h-4 w-4" />
              {isFree ? 'Reserve a ticket' : 'Buy tickets'}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-sea-400">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Mock checkout for the ticket booking flow — no real payment is taken and no tickets are issued.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
