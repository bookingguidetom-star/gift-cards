import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Plus,
  ShieldCheck,
  Ticket,
} from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchEventById } from '@/lib/queries';
import { Link } from '@/lib/router';
import { formatEuro } from '@/lib/format';
import { eventPriceFrom, eventTypeMeta, formatEventDates, generateTicketReference } from '@/lib/events';

const STEPS = ['Tickets', 'Details', 'Payment'];

interface Order {
  reference: string;
  quantity: number;
  typeLabel: string;
  total: number;
}

function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

export default function EventCheckoutPage({ eventId }: { eventId: string }) {
  const { data: event, loading, error } = useAsync(() => fetchEventById(eventId), [eventId]);

  const [step, setStep] = useState(0);
  const [quantity, setQuantity] = useState(2);
  const [ticketType, setTicketType] = useState<'standard' | 'concession'>('standard');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const basePrice = event ? eventPriceFrom(event) : 0;
  const isFree = basePrice === 0;
  const unitPrice = ticketType === 'concession' && !isFree ? Math.round(basePrice * 0.7 * 100) / 100 : basePrice;
  const total = unitPrice * quantity;

  const detailsValid = name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);
  const cardDigits = cardNumber.replace(/\s/g, '');
  const paymentValid =
    isFree || (cardName.trim().length > 1 && cardDigits.length >= 12 && expiry.length === 5 && cvc.length >= 3);

  const pay = () => {
    if (!event || processing || !paymentValid) return;
    setProcessing(true);
    timer.current = window.setTimeout(() => {
      setOrder({
        reference: generateTicketReference(),
        quantity,
        typeLabel: isFree ? 'Free entry' : ticketType === 'concession' ? 'Concession' : 'Standard',
        total,
      });
      setProcessing(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="pt-32 container-page">
        <div className="h-5 w-32 animate-pulse rounded-full bg-sea-100" />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div className="h-96 animate-pulse rounded-3xl bg-sea-100" />
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

  if (order) {
    return (
      <div className="pb-16 pt-24">
        <section className="container-page">
          <div className="mx-auto max-w-2xl rounded-3xl border border-sea-100 bg-white p-8 text-center shadow-card sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-olive-100 text-olive-700">
              <Check className="h-7 w-7" />
            </span>
            <h1 className="mt-5 font-display text-3xl font-semibold text-sea-950 sm:text-4xl">Booking confirmed</h1>
            <p className="mt-2 text-sm leading-relaxed text-sea-600">
              Your place at {event.title} is reserved. This was a mock checkout, so no payment was taken and no tickets
              were issued.
            </p>

            <div className="mt-7 rounded-2xl border border-sea-100 bg-ivory-50/60 p-5 text-left">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sea-400">Booking reference</span>
                <span className="font-display text-lg font-semibold text-sea-950">{order.reference}</span>
              </div>
              <div className="mt-4 space-y-2 border-t border-sea-100 pt-4 text-sm text-sea-600">
                <p className="font-medium text-sea-900">{event.title}</p>
                <p className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> {formatEventDates(event)}
                </p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> {event.venue_name}, {event.city_name}
                </p>
                <div className="flex items-center justify-between border-t border-sea-100 pt-3">
                  <span>
                    {order.typeLabel} × {order.quantity}
                  </span>
                  <span className="font-semibold text-sea-950">{formatEuro(order.total)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-sea-500">
                  <span>Booked for</span>
                  <span>
                    {name.trim()} · {email.trim()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to={`/event/${event.id}`} className="btn-ghost">
                <ArrowLeft className="h-4 w-4" /> Back to event
              </Link>
              <Link to="/events" className="btn-primary">
                Browse more events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="pb-16 pt-24">
      <section className="container-page">
        <Link
          to={`/event/${event.id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-sea-600 transition-colors hover:text-sea-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to event
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Ticket booking</span>
            <h1 className="mt-2 font-display text-3xl font-semibold text-sea-950 sm:text-4xl">Complete your booking</h1>

            <ol className="mt-6 flex flex-wrap items-center gap-3">
              {STEPS.map((label, index) => {
                const isDone = index < step;
                const isActive = index === step;
                return (
                  <li key={label} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => index < step && setStep(index)}
                      disabled={index > step}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        isDone
                          ? 'bg-olive-500 text-white'
                          : isActive
                            ? 'bg-sea-600 text-white'
                            : 'bg-sea-100 text-sea-500'
                      } ${isDone ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      {isDone ? <Check className="h-3.5 w-3.5" /> : index + 1}
                    </button>
                    <span
                      className={`text-xs font-semibold ${
                        isActive ? 'text-sea-900' : isDone ? 'text-sea-600' : 'text-sea-400'
                      }`}
                    >
                      {label}
                    </span>
                    {index < STEPS.length - 1 && <span className="h-px w-6 bg-sea-200 sm:w-10" />}
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 rounded-3xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
              {step === 0 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-sea-950">Choose your tickets</h2>
                  {isFree ? (
                    <p className="mt-2 rounded-xl border border-olive-200 bg-olive-50 px-4 py-3 text-sm text-olive-800">
                      This event has free entry — just pick how many places you need.
                    </p>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {[
                        { id: 'standard' as const, label: 'Standard', note: 'General admission', price: basePrice },
                        {
                          id: 'concession' as const,
                          label: 'Concession',
                          note: 'Students, seniors and children',
                          price: Math.round(basePrice * 0.7 * 100) / 100,
                        },
                      ].map((option) => (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setTicketType(option.id)}
                          className={`rounded-2xl border p-4 text-left transition-all ${
                            ticketType === option.id
                              ? 'border-sea-500 bg-sea-50 ring-1 ring-sea-500'
                              : 'border-sea-200 bg-white hover:border-sea-400'
                          }`}
                        >
                          <span className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-sea-950">{option.label}</span>
                            <span className="text-sm font-semibold text-terracotta-600">{formatEuro(option.price)}</span>
                          </span>
                          <span className="mt-1 block text-xs text-sea-500">{option.note}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-sea-100 bg-ivory-50/60 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-sea-950">Number of tickets</p>
                      <p className="text-xs text-sea-500">Up to 10 per booking</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        aria-label="Remove one ticket"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 bg-white text-sea-700 transition-colors hover:border-sea-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-sea-950" data-testid="ticket-quantity">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                        disabled={quantity >= 10}
                        aria-label="Add one ticket"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-sea-200 bg-white text-sea-700 transition-colors hover:border-sea-400 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-sea-950">Who are the tickets for?</h2>
                  <div className="mt-4 grid gap-4">
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">Full name</span>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ana Horvat"
                        className="input-field mt-1.5"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">Email</span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ana@example.com"
                        className="input-field mt-1.5"
                      />
                      <span className="mt-1 block text-xs text-sea-400">
                        We send the mock booking confirmation here.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-display text-xl font-semibold text-sea-950">Payment</h2>
                  {isFree ? (
                    <p className="mt-2 rounded-xl border border-olive-200 bg-olive-50 px-4 py-3 text-sm text-olive-800">
                      No payment is required for this event — confirm to reserve your places.
                    </p>
                  ) : (
                    <>
                      <p className="mt-2 flex items-start gap-1.5 rounded-xl border border-sand-200 bg-sand-50 px-4 py-3 text-xs leading-relaxed text-sand-800">
                        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        Mock checkout: enter any demo card details. Nothing is charged and no card data is stored.
                      </p>
                      <div className="mt-4 grid gap-4">
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">Cardholder name</span>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Ana Horvat"
                            className="input-field mt-1.5"
                          />
                        </label>
                        <label className="block">
                          <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">Card number</span>
                          <div className="relative mt-1.5">
                            <CreditCard className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sea-400" />
                            <input
                              type="text"
                              inputMode="numeric"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                              placeholder="4242 4242 4242 4242"
                              className="input-field pl-11"
                            />
                          </div>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">Expiry</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={expiry}
                              onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                              placeholder="MM/YY"
                              className="input-field mt-1.5"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs font-semibold uppercase tracking-wider text-sea-500">CVC</span>
                            <input
                              type="text"
                              inputMode="numeric"
                              value={cvc}
                              onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="123"
                              className="input-field mt-1.5"
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-sea-50 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep((s) => s + 1)}
                    disabled={step === 1 && !detailsValid}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Continue <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={pay}
                    disabled={!paymentValid || processing}
                    className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing…
                      </>
                    ) : (
                      <>
                        <Ticket className="h-4 w-4" />
                        {isFree ? 'Confirm booking' : `Pay ${formatEuro(total)}`}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-sea-100 bg-white p-6 shadow-card lg:sticky lg:top-24">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">Order summary</span>
            <span className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider ring-1 ${meta.color}`}>
              <Icon className="h-3 w-3" />
              {meta.label}
            </span>
            <h2 className="mt-2 font-display text-xl font-semibold leading-snug text-sea-950">{event.title}</h2>
            <div className="mt-3 space-y-1.5 text-sm text-sea-600">
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 shrink-0" /> {event.venue_name}, {event.city_name}
              </p>
              <p className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" /> {formatEventDates(event)}
              </p>
            </div>

            <div className="mt-5 space-y-2 border-t border-sea-100 pt-4 text-sm">
              <div className="flex items-center justify-between text-sea-600">
                <span>{isFree ? 'Free entry' : ticketType === 'concession' ? 'Concession' : 'Standard'} × {quantity}</span>
                <span>{formatEuro(total)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-sea-100 pt-2 font-semibold text-sea-950">
                <span>Total</span>
                <span>{formatEuro(total)}</span>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-1.5 text-xs leading-relaxed text-sea-400">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Mock checkout — no real payment is processed and no tickets are issued.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
