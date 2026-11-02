import { Calendar, Sparkles, Ticket, type LucideIcon } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DEFAULT_TICKET_PRICE = 15;

interface PricedEvent {
  price_range: string | null;
}

interface DatedEvent {
  start_date: string;
  end_date: string | null;
  start_month: number;
  date_precision: 'day' | 'month';
}

export interface EventTypeMeta {
  label: string;
  icon: LucideIcon;
  dot: string;
  color: string;
}

export const EVENT_TYPE_META: Record<string, EventTypeMeta> = {
  exhibition: { label: 'Exhibition', icon: Sparkles, dot: 'bg-violet-400', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  performance: { label: 'Performance', icon: Ticket, dot: 'bg-terracotta-400', color: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200' },
  screening: { label: 'Screening', icon: Ticket, dot: 'bg-sky-400', color: 'bg-sky-50 text-sky-700 ring-sky-200' },
  festival: { label: 'Festival', icon: Sparkles, dot: 'bg-amber-400', color: 'bg-amber-50 text-amber-700 ring-amber-200' },
  sport: { label: 'Sport', icon: Ticket, dot: 'bg-blue-400', color: 'bg-blue-50 text-blue-700 ring-blue-200' },
  concert: { label: 'Concert', icon: Ticket, dot: 'bg-emerald-400', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  workshop: { label: 'Workshop', icon: Sparkles, dot: 'bg-stone-400', color: 'bg-stone-100 text-stone-700 ring-stone-300' },
  permanent_collection: { label: 'Permanent', icon: Calendar, dot: 'bg-sea-400', color: 'bg-sea-50 text-sea-700 ring-sea-200' },
  dance: { label: 'Dance', icon: Ticket, dot: 'bg-rose-400', color: 'bg-rose-50 text-rose-700 ring-rose-200' },
  film_festival: { label: 'Film Festival', icon: Ticket, dot: 'bg-indigo-400', color: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
};

export function eventTypeMeta(eventType: string): EventTypeMeta {
  return EVENT_TYPE_META[eventType] ?? EVENT_TYPE_META.exhibition;
}

/** Mock ticket price derived from the event's published price range. */
export function eventPriceFrom(event: PricedEvent): number {
  if (!event.price_range) return DEFAULT_TICKET_PRICE;
  if (/free|besplatno/i.test(event.price_range)) return 0;
  const match = event.price_range.match(/\d+(?:[.,]\d+)?/);
  if (!match) return DEFAULT_TICKET_PRICE;
  return Number(match[0].replace(',', '.'));
}

export function formatEventDates(event: DatedEvent): string {
  if (event.date_precision === 'month') {
    const endMonth = event.end_date ? Number(event.end_date.slice(5, 7)) : event.start_month;
    const months =
      endMonth === event.start_month
        ? MONTH_NAMES[event.start_month - 1]
        : `${MONTH_NAMES[event.start_month - 1]}–${MONTH_NAMES[endMonth - 1]}`;
    return `${months} ${event.start_date.slice(0, 4)} · dates to be confirmed`;
  }

  const [startYear, startMonth, startDay] = event.start_date.split('-').map(Number);
  const start = new Date(startYear, startMonth - 1, startDay);
  const startLabel = `${start.getDate()} ${MONTH_NAMES[start.getMonth()]} ${start.getFullYear()}`;
  if (!event.end_date) return startLabel;

  const [endYear, endMonth, endDay] = event.end_date.split('-').map(Number);
  const end = new Date(endYear, endMonth - 1, endDay);
  const endLabel =
    end.getFullYear() === start.getFullYear()
      ? `${end.getDate()} ${MONTH_NAMES[end.getMonth()]}`
      : `${end.getDate()} ${MONTH_NAMES[end.getMonth()]} ${end.getFullYear()}`;
  if (start.getTime() === end.getTime()) return startLabel;
  return `${startLabel} – ${endLabel}`;
}

export function generateTicketReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i += 1) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `TCK-${code}`;
}
