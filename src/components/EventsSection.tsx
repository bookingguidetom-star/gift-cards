import { useState } from 'react';
import {
  Calendar,
  Clock,
  Ticket,
  ExternalLink,
  Repeat,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { VenueEvent } from '@/lib/types';
import { Link } from '@/lib/router';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const EVENT_TYPE_META: Record<string, { label: string; icon: LucideIcon; color: string }> = {
  exhibition: { label: 'Exhibition', icon: Sparkles, color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  performance: { label: 'Performance', icon: Ticket, color: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200' },
  screening: { label: 'Screening', icon: Ticket, color: 'bg-sea-50 text-sea-700 ring-sea-200' },
  festival: { label: 'Festival', icon: Sparkles, color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  concert: { label: 'Concert', icon: Ticket, color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  workshop: { label: 'Workshop', icon: Sparkles, color: 'bg-stone-100 text-stone-700 ring-stone-300' },
  permanent_collection: { label: 'Permanent', icon: Calendar, color: 'bg-sea-50 text-sea-700 ring-sea-200' },
  dance: { label: 'Dance', icon: Ticket, color: 'bg-rose-50 text-rose-700 ring-rose-200' },
  film_festival: { label: 'Film Festival', icon: Ticket, color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
};

function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const startStr = `${startDate.getDate()} ${MONTH_NAMES[startDate.getMonth()]}`;
  if (!end) return startStr;
  const endDate = new Date(end);
  const endStr = `${endDate.getDate()} ${MONTH_NAMES[endDate.getMonth()]}`;
  if (startDate.getMonth() === endDate.getMonth() && startDate.getFullYear() === endDate.getFullYear()) {
    return `${startDate.getDate()}–${endStr}`;
  }
  return `${startStr} – ${endStr}`;
}

function getSeason(month: number): string {
  if (month >= 6 && month <= 8) return 'Summer';
  if (month >= 9 && month <= 11) return 'Autumn';
  if (month >= 3 && month <= 5) return 'Spring';
  return 'Winter';
}

export default function EventsSection({
  cityName,
  events,
}: {
  cityName: string;
  events: VenueEvent[];
}) {
  const [filter, setFilter] = useState<string>('all');

  if (!events || events.length === 0) return null;

  const seasons = ['all', 'Spring', 'Summer', 'Autumn', 'Winter'];
  const filtered = filter === 'all'
    ? events
    : events.filter((e) => getSeason(e.start_month) === filter);

  return (
    <section className="container-page mt-14">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
          What's On
        </span>
        <h2 className="mt-1 font-display text-3xl font-semibold text-sea-950">
          Events & programs in {cityName}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-sea-600">
          Exhibitions, performances, screenings, and festivals happening at cultural venues throughout the year.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
        {seasons.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilter(s)}
            className={`chip cursor-pointer border transition-colors ${
              filter === s
                ? 'border-sea-500 bg-sea-500 text-white'
                : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
            }`}
          >
            {s === 'all' ? 'All Year' : s}
          </button>
        ))}
        </div>
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
        >
          View full calendar <ExternalLink className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((event) => {
          const meta = EVENT_TYPE_META[event.event_type] ?? EVENT_TYPE_META.exhibition;
          const Icon = meta.icon;
          return (
            <div
              key={event.id}
              className="group flex flex-col rounded-2xl border border-sea-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${meta.color}`}
                >
                  <Icon className="h-3 w-3" />
                  {meta.label}
                </span>
                {event.is_recurring && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-sea-400">
                    <Repeat className="h-3 w-3" /> Annual
                  </span>
                )}
              </div>

              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-sea-950">
                {event.title}
              </h3>

              <div className="mt-2 flex items-center gap-2 text-sm text-sea-500">
                <Calendar className="h-3.5 w-3.5 shrink-0" />
                <span>{formatDateRange(event.start_date, event.end_date)}</span>
              </div>

              {event.schedule_note && (
                <div className="mt-1 flex items-start gap-2 text-xs text-sea-400">
                  <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                  <span>{event.schedule_note}</span>
                </div>
              )}

              {event.description && (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-sea-600">
                  {event.description}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between border-t border-sea-50 pt-3">
                {event.price_range ? (
                  <span className="text-xs font-medium text-sea-500">
                    {event.price_range}
                  </span>
                ) : (
                  <span />
                )}
                {event.ticket_url && (
                  <a
                    href={event.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 transition-colors hover:text-terracotta-700"
                  >
                    Tickets & info <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
