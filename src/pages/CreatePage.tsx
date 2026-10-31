import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Gift, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAsync } from '@/lib/useAsync';
import { fetchCities, fetchVenuesByIds } from '@/lib/queries';
import { CATEGORY_META, CATEGORY_ORDER, type City, type Venue, type VenueCategory } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import { Link } from '@/lib/router';
import { formatEuro, generateGiftCardCode } from '@/lib/format';
import type { GiftCard } from '@/lib/types';

const PRESET_AMOUNTS = [25, 50, 75, 100, 150, 200];

type Step = 'amount' | 'experience' | 'recipient' | 'preview';

export default function CreatePage() {
  const cities = useAsync(fetchCities, []);

  const [step, setStep] = useState<Step>('amount');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCityId, setSelectedCityId] = useState<string | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'all'>('all');
  const [selectedVenueIds, setSelectedVenueIds] = useState<string[]>([]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [personalMessage, setPersonalMessage] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string>('');
  const [design, setDesign] = useState<'terracotta' | 'sea' | 'sand'>('terracotta');

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createdCard, setCreatedCard] = useState<GiftCard | null>(null);

  const finalAmount = customAmount && Number(customAmount) > 0 ? Number(customAmount) : amount;

  const selectedCity: City | undefined = useMemo(
    () => (selectedCityId === 'all' ? undefined : cities.data?.find((c) => c.id === selectedCityId)),
    [selectedCityId, cities.data],
  );

  const selectedVenuesHook = useAsync(
    () => fetchVenuesByIds(selectedVenueIds),
    [selectedVenueIds.join(',')],
  );

  const stepIndex = ['amount', 'experience', 'recipient', 'preview'].indexOf(step);

  const toggleVenue = (id: string) => {
    setSelectedVenueIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const next = () => {
    if (step === 'amount') setStep('experience');
    else if (step === 'experience') setStep('recipient');
    else if (step === 'recipient') setStep('preview');
  };
  const back = () => {
    if (step === 'experience') setStep('amount');
    else if (step === 'recipient') setStep('experience');
    else if (step === 'preview') setStep('recipient');
  };

  const canProceed = () => {
    if (step === 'amount') return finalAmount >= 5 && finalAmount <= 5000;
    if (step === 'experience') return true; // venue selection is optional
    if (step === 'recipient') {
      return recipientName.trim() && /\S+@\S+\.\S+/.test(recipientEmail);
    }
    return true;
  };

  const submit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const code = generateGiftCardCode();
      const { data, error } = await supabase
        .from('gift_cards')
        .insert({
          code,
          amount_eur: finalAmount,
          balance_eur: finalAmount,
          recipient_name: recipientName,
          recipient_email: recipientEmail,
          buyer_name: buyerName || null,
          buyer_email: buyerEmail || null,
          personal_message: personalMessage || null,
          delivery_date: deliveryDate || null,
          status: 'sent',
          selected_venue_ids: selectedVenueIds,
        })
        .select()
        .single();
      if (error) throw error;
      setCreatedCard(data);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not create the gift card.');
    } finally {
      setSubmitting(false);
    }
  };

  if (createdCard) {
    return <SuccessView card={createdCard} city={selectedCity} venues={selectedVenuesHook.data ?? []} />;
  }

  const designBg = {
    terracotta: 'from-terracotta-500 to-terracotta-700',
    sea: 'from-sea-600 to-sea-900',
    sand: 'from-sand-500 to-sand-700',
  }[design];

  return (
    <div className="pt-20">
      <section className="container-page mt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-sea-500 hover:text-sea-800">
          <ArrowLeft className="h-4 w-4" /> Home
        </Link>
        <h1 className="mt-3 font-display text-4xl font-semibold text-sea-950 sm:text-5xl">
          Create a gift card
        </h1>
        <p className="mt-2 max-w-2xl text-sea-600">
          Four quick steps. You can lock the card to a city and venue, or leave it open for the recipient to choose.
        </p>

        {/* Stepper */}
        <ol className="mt-8 flex flex-wrap gap-3">
          {[
            { key: 'amount', label: 'Amount' },
            { key: 'experience', label: 'Experience' },
            { key: 'recipient', label: 'Recipient' },
            { key: 'preview', label: 'Preview & send' },
          ].map((s, i) => {
            const active = step === s.key;
            const done = stepIndex > i;
            return (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => (i <= stepIndex ? setStep(s.key as Step) : undefined)}
                  disabled={i > stepIndex}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-sea-500 bg-sea-500 text-white'
                      : done
                      ? 'border-olive-300 bg-olive-50 text-olive-700'
                      : 'border-sea-200 bg-white text-sea-500'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${
                    active ? 'bg-white/20' : done ? 'bg-olive-500 text-white' : 'bg-sea-100'
                  }`}>
                    {done ? <Check className="h-3 w-3" /> : i + 1}
                  </span>
                  {s.label}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Main panel */}
          <div className="lg:col-span-3">
            {step === 'amount' && (
              <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-sea-950">Choose an amount</h2>
                <p className="mt-1 text-sm text-sea-600">From €25 to €2,000. Most cards land between €50 and €150.</p>
                <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-3">
                  {PRESET_AMOUNTS.map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => { setAmount(amt); setCustomAmount(''); }}
                      className={`rounded-xl border px-4 py-4 text-center transition-colors ${
                        !customAmount && amount === amt
                          ? 'border-terracotta-500 bg-terracotta-50 text-terracotta-700'
                          : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
                      }`}
                    >
                      <span className="block font-display text-xl font-semibold">{formatEuro(amt)}</span>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <label htmlFor="custom" className="block text-sm font-semibold text-sea-800">Custom amount</label>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sea-500">€</span>
                    <input
                      id="custom"
                      type="number"
                      min={5}
                      max={2000}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Or enter your own"
                      className="input-field pl-8"
                    />
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 rounded-xl bg-sea-50 p-4 text-sm text-sea-700">
                  <Sparkles className="h-4 w-4 text-terracotta-500" />
                  <span>Tip: €100 typically covers a dinner for two at a top-rated table in Split or Dubrovnik.</span>
                </div>
              </div>
            )}

            {step === 'experience' && (
              <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-sea-950">Pick an experience (optional)</h2>
                <p className="mt-1 text-sm text-sea-600">Narrow by city and category, then tick venues. Or skip to let the recipient decide.</p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <FilterChip active={selectedCityId === 'all'} onClick={() => setSelectedCityId('all')} label="All cities" />
                  {(cities.data ?? []).map((c) => (
                    <FilterChip key={c.id} active={selectedCityId === c.id} onClick={() => setSelectedCityId(c.id)} label={c.name} />
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')} label="All categories" />
                  {CATEGORY_ORDER.map((cat) => (
                    <FilterChip
                      key={cat}
                      active={selectedCategory === cat}
                      onClick={() => setSelectedCategory(cat)}
                      label={CATEGORY_META[cat].shortLabel}
                      icon={<CategoryIcon category={cat} className="h-3.5 w-3.5" />}
                    />
                  ))}
                </div>

                {/* Venue picker - simplified: query venues on demand */}
                <VenuePicker
                  cityId={selectedCityId}
                  category={selectedCategory}
                  selectedIds={selectedVenueIds}
                  onToggle={toggleVenue}
                />

                {selectedVenueIds.length > 0 && (
                  <div className="mt-5 rounded-xl bg-olive-50 p-4 text-sm text-olive-700">
                    {selectedVenueIds.length} venue{selectedVenueIds.length > 1 ? 's' : ''} selected — the recipient can spend the balance at any of these.
                  </div>
                )}
              </div>
            )}

            {step === 'recipient' && (
              <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-sea-950">Who's it for?</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <Field label="Recipient name *">
                    <input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="input-field" placeholder="Ana Horvat" />
                  </Field>
                  <Field label="Recipient email *">
                    <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="input-field" placeholder="ana@example.com" />
                  </Field>
                  <Field label="Your name">
                    <input value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className="input-field" placeholder="Optional" />
                  </Field>
                  <Field label="Your email">
                    <input type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} className="input-field" placeholder="Optional" />
                  </Field>
                </div>
                <Field label="Personal message" className="mt-4">
                  <textarea
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Sretan rođendan! Enjoy a slice of the Adriatic. — Love, Marko"
                  />
                </Field>
                <Field label="Delivery date" className="mt-4">
                  <input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="input-field" />
                  <p className="mt-1 text-xs text-sea-500">Leave empty to send immediately.</p>
                </Field>
              </div>
            )}

            {step === 'preview' && (
              <div className="rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
                <h2 className="font-display text-2xl font-semibold text-sea-950">Preview & confirm</h2>
                <p className="mt-1 text-sm text-sea-600">This is what your recipient will see. Pick a card design, then send.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {(['terracotta', 'sea', 'sand'] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDesign(d)}
                      className={`rounded-xl border-2 p-2 transition-colors ${
                        design === d ? 'border-sea-500' : 'border-transparent hover:border-sea-200'
                      }`}
                    >
                      <div className={`h-20 rounded-lg bg-gradient-to-br ${designBgFor(d)}`} />
                      <span className="mt-2 block text-xs font-semibold capitalize text-sea-700">{d}</span>
                    </button>
                  ))}
                </div>

                <dl className="mt-6 space-y-2 border-t border-sea-100 pt-4 text-sm">
                  <Row label="Amount" value={formatEuro(finalAmount)} />
                  <Row label="Recipient" value={`${recipientName} · ${recipientEmail}`} />
                  {selectedCity && <Row label="City" value={selectedCity.name} />}
                  {selectedVenueIds.length > 0 && <Row label="Venues" value={`${selectedVenueIds.length} selected`} />}
                  {deliveryDate && <Row label="Delivery date" value={deliveryDate} />}
                </dl>

                {submitError && (
                  <div className="mt-4 rounded-xl border border-terracotta-200 bg-terracotta-50 p-4 text-sm text-terracotta-800">
                    {submitError}
                  </div>
                )}

                <button onClick={submit} disabled={submitting} className="btn-primary mt-6 w-full">
                  {submitting ? 'Creating...' : 'Create & send gift card'}
                </button>
              </div>
            )}

            {/* Nav buttons */}
            <div className="mt-6 flex justify-between">
              <button onClick={back} disabled={step === 'amount'} className="btn-ghost disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step !== 'preview' && (
                <button onClick={next} disabled={!canProceed()} className="btn-primary">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Live preview card */}
          <aside className="lg:col-span-2">
            <div className="sticky top-24">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-sea-500">Live preview</p>
              <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${designBg} p-6 text-white shadow-card`}>
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
                <div className="absolute -bottom-16 -left-8 h-44 w-44 rounded-full bg-black/10" />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                      <Gift className="h-5 w-5" />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Croatia Gifts</span>
                  </div>
                  <p className="mt-8 text-xs uppercase tracking-wider opacity-80">Gift card value</p>
                  <p className="font-display text-5xl font-semibold">{formatEuro(finalAmount)}</p>
                  {selectedCity && (
                    <p className="mt-2 text-sm opacity-90">For {selectedCity.name}</p>
                  )}
                  {recipientName && (
                    <p className="mt-6 text-sm opacity-90">To: {recipientName}</p>
                  )}
                  {personalMessage && (
                    <p className="mt-3 line-clamp-3 text-sm italic opacity-90">"{personalMessage}"</p>
                  )}
                  <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs">
                    <span className="opacity-70">Code visible after purchase</span>
                    <span className="font-mono tracking-widest opacity-90">•••• ••••</span>
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-sea-500">Preview only — no card is created until you confirm on the last step.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

function designBgFor(d: 'terracotta' | 'sea' | 'sand') {
  return {
    terracotta: 'from-terracotta-500 to-terracotta-700',
    sea: 'from-sea-600 to-sea-900',
    sand: 'from-sand-500 to-sand-700',
  }[d];
}

function FilterChip({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`chip cursor-pointer border transition-colors ${
        active
          ? 'border-sea-500 bg-sea-500 text-white'
          : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function Field({
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
      <label className="block text-sm font-semibold text-sea-800">{label}</label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-sea-50 pb-2">
      <dt className="text-sea-500">{label}</dt>
      <dd className="font-medium text-sea-950">{value}</dd>
    </div>
  );
}

function VenuePicker({
  cityId,
  category,
  selectedIds,
  onToggle,
}: {
  cityId: string | 'all';
  category: VenueCategory | 'all';
  selectedIds: string[];
  onToggle: (id: string) => void;
}) {
  const venues = useAsync(async () => {
    let query = supabase.from('venues').select('*').order('featured', { ascending: false }).order('rating', { ascending: false });
    if (cityId !== 'all') query = query.eq('city_id', cityId);
    if (category !== 'all') query = query.eq('category', category);
    query = query.limit(24);
    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  }, [cityId, category]);

  if (venues.loading) {
    return <div className="mt-6 grid gap-3 sm:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-pulse rounded-xl bg-sea-100" />)}</div>;
  }
  if (venues.error) {
    return <div className="mt-6 rounded-xl border border-terracotta-200 bg-terracotta-50 p-4 text-sm text-terracotta-800">{venues.error}</div>;
  }
  if (!venues.data || venues.data.length === 0) {
    return <div className="mt-6 rounded-xl border border-sea-200 bg-sea-50 p-6 text-center text-sm text-sea-600">No venues match these filters. Try another city or category.</div>;
  }
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {(venues.data as Venue[]).map((v) => {
        const selected = selectedIds.includes(v.id);
        return (
          <button
            key={v.id}
            type="button"
            onClick={() => onToggle(v.id)}
            className={`flex items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
              selected ? 'border-olive-400 bg-olive-50' : 'border-sea-200 bg-white hover:border-sea-400'
            }`}
          >
            <span className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${selected ? 'border-olive-500 bg-olive-500 text-white' : 'border-sea-300'}`}>
              {selected && <Check className="h-3.5 w-3.5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-sea-950">{v.name}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-sea-500">
                <CategoryIcon category={v.category} className="h-3 w-3" />
                {CATEGORY_META[v.category].shortLabel}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function SuccessView({ card, city, venues }: { card: GiftCard; city?: City; venues: Venue[] }) {
  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <div className="mx-auto max-w-2xl text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-olive-100 text-olive-600">
            <Check className="h-8 w-8" />
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold text-sea-950">Gift card created</h1>
          <p className="mt-2 text-sea-600">
            {card.recipient_name} will receive a {formatEuro(card.amount_eur)} gift card{city ? ` for ${city.name}` : ''} at {card.recipient_email}.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-terracotta-500 to-terracotta-700 p-6 text-white shadow-card">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
          <div className="relative">
            <div className="flex items-center justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                <Gift className="h-5 w-5" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Croatia Gifts</span>
            </div>
            <p className="mt-6 text-xs uppercase tracking-wider opacity-80">Gift card value</p>
            <p className="font-display text-5xl font-semibold">{formatEuro(card.amount_eur)}</p>
            {city && <p className="mt-2 text-sm opacity-90">For {city.name}</p>}
            <p className="mt-6 text-sm opacity-90">To: {card.recipient_name}</p>
            {card.personal_message && <p className="mt-3 line-clamp-3 text-sm italic opacity-90">"{card.personal_message}"</p>}
            <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs">
              <span className="opacity-70">Card code</span>
              <span className="font-mono text-lg tracking-[0.25em]">{card.code}</span>
            </div>
          </div>
        </div>

        {venues.length > 0 && (
          <div className="mx-auto mt-6 max-w-md rounded-xl border border-sea-100 bg-white p-5 text-sm">
            <p className="font-semibold text-sea-900">Valid at {venues.length} selected {venues.length === 1 ? 'venue' : 'venues'}:</p>
            <ul className="mt-2 space-y-1 text-sea-600">
              {venues.slice(0, 6).map((v) => <li key={v.id}>· {v.name}</li>)}
              {venues.length > 6 && <li className="text-sea-400">...and {venues.length - 6} more</li>}
            </ul>
          </div>
        )}

        <div className="mx-auto mt-8 flex max-w-md justify-center gap-3">
          <Link to="/balance" className="btn-ghost">Check balance</Link>
          <Link to="/" className="btn-primary">Back home</Link>
        </div>
      </section>
    </div>
  );
}
