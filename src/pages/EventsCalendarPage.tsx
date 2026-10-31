import { useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Clock,
  Ticket,
  ExternalLink,
  Repeat,
  X,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchEventsCalendarData, type CalendarEvent } from '@/lib/queries';
import { Link } from '@/lib/router';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const EVENT_TYPE_META: Record<string, { label: string; icon: LucideIcon; dot: string; color: string }> = {
  exhibition: { label: 'Exhibition', icon: Sparkles, dot: 'bg-violet-400', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  performance: { label: 'Performance', icon: Ticket, dot: 'bg-terracotta-400', color: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200' },
  screening: { label: 'Screening', icon: Ticket, dot: 'bg-sky-400', color: 'bg-sky-50 text-sky-700 ring-sky-200' },
  festival: { label: 'Festival', icon: Sparkles, dot: 'bg-amber-400', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  concert: { label: 'Concert', icon: Ticket, dot: 'bg-emerald-400', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  workshop: { label: 'Workshop', icon: Sparkles, dot: 'bg-stone-400', color: 'bg-stone-100 text-stone-700 ring-stone-300' },
  permanent_collection: { label: 'Permanent', icon: CalendarDays, dot: 'bg-sea-400', color: 'bg-sea-50 text-sea-700 ring-sea-200' },
  dance: { label: 'Dance', icon: Ticket, dot: 'bg-rose-400', color: 'bg-rose-50 text-rose-700 ring-rose-200' },
  film_festival: { label: 'Film Festival', icon: Ticket, dot: 'bg-indigo-400', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
};

const ALL_EVENT_TYPES = Object.keys(EVENT_TYPE_META);

interface DayCell {
  date: Date;
  isCurrentMonth: boolean;
  dayKey: string;
}

function buildMonthGrid(year: number, month: number): DayCell[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const days: DayCell[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    days.push({ date: d, isCurrentMonth: false, dayKey: dayKey(d) });
  }
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const date = new Date(year, month, d);
    days.push({ date, isCurrentMonth: true, dayKey: dayKey(date) });
  }
  while (days.length % 7 !== 0) {
    const last = days[days.length - 1].date;
    const d = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false, dayKey: dayKey(d) });
  }
  while (days.length < 42) {
    const last = days[days.length - 1].date;
    const d = new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1);
    days.push({ date: d, isCurrentMonth: false, dayKey: dayKey(d) });
  }
  return days;
}

function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function eventCoversDay(event: CalendarEvent, key: string): boolean {
  const start = new Date(event.start_date + 'T00:00:00');
  const startKey = dayKey(start);
  if (key < startKey) return false;
  if (event.is_recurring) {
    const end = event.end_date ? new Date(event.end_date + 'T00:00:00') : start;
    const endKey = dayKey(end);
    return key <= endKey;
  }
  if (event.end_date) {
    const endKey = dayKey(new Date(event.end_date + 'T00:00:00'));
    return key <= endKey;
  }
  return key === startKey;
}

export default function EventsCalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  const { data: allEvents, loading, error } = useAsync(() => fetchEventsCalendarData(), []);

  const cities = useMemo(() => {
    const set = new Map<string, string>();
    allEvents?.forEach((e) => {
      if (e.city_slug) set.set(e.city_slug, e.city_name);
    });
    return Array.from(set.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allEvents]);

  const filteredEvents = useMemo(() => {
    if (!allEvents) return [];
    return allEvents.filter((e) => {
      if (typeFilter !== 'all' && e.event_type !== typeFilter) return false;
      if (cityFilter !== 'all' && e.city_slug !== cityFilter) return false;
      return true;
    });
  }, [allEvents, typeFilter, cityFilter]);

  const monthGrid = useMemo(() => buildMonthGrid(year, month), [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const cell of monthGrid) {
      const events = filteredEvents
        .filter((e) => eventCoversDay(e, cell.dayKey))
        .sort((a, b) => a.start_date.localeCompare(b.start_date));
      if (events.length > 0) map.set(cell.dayKey, events);
    }
    return map;
  }, [monthGrid, filteredEvents]);

  const selectedEvents = selectedDay ? eventsByDay.get(selectedDay) ?? [] : [];

  function goPrev() {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
    setSelectedDay(null);
  }
  function goNext() {
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
    setSelectedDay(null);
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(null);
  }

  if (loading) {
    return (
      <div className="pt-32 container-page">
        <div className="h-10 w-64 animate-pulse rounded-xl bg-sea-100" />
        <div className="mt-6 h-96 animate-pulse rounded-2xl bg-sea-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-32 container-page">
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-12 text-center">
          <p className="text-terracotta-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="container-page">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">
            Cultural Calendar
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-sea-950 sm:text-5xl">
            Events across Croatia
          </h1>
          <p className="mt-3 text-base leading-relaxed text-sea-600">
            Browse museum exhibitions, theatre performances, film screenings, and festivals happening across all {cities.length} cities. Click any day to see what's on.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="container-page mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setTypeFilter('all')}
              className={`chip cursor-pointer border transition-colors ${
                typeFilter === 'all'
                  ? 'border-sea-500 bg-sea-500 text-white'
                  : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
              }`}
            >
              All types
            </button>
            {ALL_EVENT_TYPES.filter((t) => allEvents?.some((e) => e.event_type === t)).map((t) => {
              const meta = EVENT_TYPE_META[t];
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTypeFilter(t)}
                  className={`chip cursor-pointer border transition-colors ${
                    typeFilter === t
                      ? 'border-sea-500 bg-sea-500 text-white'
                      : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  {meta.label}
                </button>
              );
            })}
          </div>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="rounded-xl border border-sea-200 bg-white px-4 py-2 text-sm text-sea-700 shadow-soft focus:border-sea-500 focus:outline-none focus:ring-2 focus:ring-sea-500/20"
          >
            <option value="all">All cities</option>
            {cities.map(([slug, name]) => (
              <option key={slug} value={slug}>{name}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Calendar */}
      <section className="container-page mt-6">
        <div className="rounded-3xl border border-sea-100 bg-white shadow-soft">
          {/* Month nav */}
          <div className="flex items-center justify-between gap-4 border-b border-sea-100 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 bg-white text-sea-700 transition-colors hover:border-sea-400 hover:bg-sea-50"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 bg-white text-sea-700 transition-colors hover:border-sea-400 hover:bg-sea-50"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <h2 className="font-display text-xl font-semibold text-sea-950 sm:text-2xl">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              type="button"
              onClick={goToday}
              className="rounded-full border border-sea-200 bg-white px-4 py-1.5 text-xs font-semibold text-sea-700 transition-colors hover:border-sea-400 hover:bg-sea-50"
            >
              Today
            </button>
          </div>

          {/* Weekday labels */}
          <div className="grid grid-cols-7 border-b border-sea-100">
            {WEEKDAY_LABELS.map((d) => (
              <div key={d} className="px-1 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider text-sea-400 sm:text-xs">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {monthGrid.map((cell, i) => {
              const dayEvents = eventsByDay.get(cell.dayKey) ?? [];
              const isToday = cell.dayKey === dayKey(today);
              const isSelected = cell.dayKey === selectedDay;
              const dayNum = cell.date.getDate();
              const maxDots = 4;

              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedDay(isSelected ? null : cell.dayKey)}
                  className={`relative flex min-h-[80px] flex-col border-b border-r border-sea-50 p-1.5 text-left transition-colors sm:min-h-[110px] sm:p-2 ${
                    cell.isCurrentMonth ? 'bg-white' : 'bg-sea-50/30'
                  } ${isSelected ? 'ring-2 ring-inset ring-sea-500' : 'hover:bg-sea-50/50'}`}
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                      isToday
                        ? 'bg-terracotta-500 text-white'
                        : cell.isCurrentMonth
                          ? 'text-sea-900'
                          : 'text-sea-300'
                    }`}
                  >
                    {dayNum}
                  </span>
                  {dayEvents.length > 0 && (
                    <div className="mt-1 flex flex-1 flex-col gap-0.5">
                      {dayEvents.slice(0, 2).map((e) => {
                        const meta = EVENT_TYPE_META[e.event_type] ?? EVENT_TYPE_META.exhibition;
                        return (
                          <span
                            key={e.id}
                            className={`hidden truncate rounded px-1 py-0.5 text-[10px] font-medium leading-tight sm:inline-block ${meta.color} ring-1`}
                          >
                            {e.title}
                          </span>
                        );
                      })}
                      {dayEvents.length > 2 && (
                        <span className="hidden text-[10px] font-medium text-sea-400 sm:inline">
                          +{dayEvents.length - 2} more
                        </span>
                      )}
                      <div className="mt-auto flex flex-wrap gap-0.5 sm:hidden">
                        {dayEvents.slice(0, maxDots).map((e) => {
                          const meta = EVENT_TYPE_META[e.event_type] ?? EVENT_TYPE_META.exhibition;
                          return <span key={e.id} className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />;
                        })}
                        {dayEvents.length > maxDots && (
                          <span className="text-[9px] font-semibold text-sea-400">+{dayEvents.length - maxDots}</span>
                        )}
                      </div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Selected day detail */}
      {selectedDay && (
        <section className="container-page mt-6">
          <div className="rounded-2xl border border-sea-100 bg-white p-5 shadow-soft sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
                  {selectedEvents.length > 0 ? `${selectedEvents.length} event${selectedEvents.length === 1 ? '' : 's'}` : 'No events'}
                </span>
                <h3 className="mt-1 font-display text-2xl font-semibold text-sea-950">
                  {formatSelectedDay(selectedDay)}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDay(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 bg-white text-sea-600 transition-colors hover:border-sea-400 hover:bg-sea-50"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {selectedEvents.length === 0 ? (
              <p className="mt-4 text-sm text-sea-500">
                No events on this date. Try a different day or adjust the filters above.
              </p>
            ) : (
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {selectedEvents.map((event) => {
                  const meta = EVENT_TYPE_META[event.event_type] ?? EVENT_TYPE_META.exhibition;
                  const Icon = meta.icon;
                  return (
                    <div
                      key={event.id}
                      className="group flex flex-col rounded-xl border border-sea-100 bg-ivory-50/50 p-4 transition-all duration-300 hover:border-sea-200 hover:bg-white hover:shadow-soft"
                    >
                      <div className="flex items-center gap-2">
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
                      <h4 className="mt-2 font-display text-base font-semibold leading-snug text-sea-950">
                        {event.title}
                      </h4>
                      <Link
                        to={`/city/${event.city_slug}`}
                        className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-sea-500 hover:text-sea-700"
                      >
                        <MapPin className="h-3 w-3" />
                        {event.venue_name}, {event.city_name}
                      </Link>
                      {event.schedule_note && (
                        <div className="mt-1.5 flex items-start gap-1.5 text-xs text-sea-400">
                          <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{event.schedule_note}</span>
                        </div>
                      )}
                      {event.description && (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-sea-600">
                          {event.description}
                        </p>
                      )}
                      <div className="mt-3 flex items-center justify-between border-t border-sea-50 pt-2.5">
                        {event.price_range ? (
                          <span className="text-xs font-medium text-sea-500">{event.price_range}</span>
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
            )}
          </div>
        </section>
      )}

      {/* Month quick nav */}
      <section className="container-page mt-8 pb-8">
        <div className="flex flex-wrap gap-2">
          {MONTH_NAMES.map((m, i) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMonth(i); setSelectedDay(null); }}
              className={`chip cursor-pointer border transition-colors ${
                i === month && year === today.getFullYear()
                  ? 'border-sea-500 bg-sea-500 text-white'
                  : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
              }`}
            >
              {MONTH_SHORT[i]}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatSelectedDay(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
  return `${weekday}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
}
