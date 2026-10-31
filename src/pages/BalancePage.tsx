import { useState } from 'react';
import { CheckCircle2, Search, Wallet } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { GiftCard } from '@/lib/types';
import { formatEuro, formatDate } from '@/lib/format';
import SectionHeader from '@/components/SectionHeader';

export default function BalancePage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GiftCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = async () => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length < 8) {
      setError('Enter a gift card code (at least 8 characters).');
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: queryError } = await supabase
        .from('gift_cards')
        .select('*')
        .eq('code', trimmed)
        .maybeSingle();
      if (queryError) throw queryError;
      if (!data) {
        setError('No gift card found with that code. Double-check and try again.');
        setResult(null);
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not look up the card.');
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <SectionHeader
          eyebrow="Check balance"
          title="See your gift card balance"
          subtitle="Enter the 12-character code from the gift card email or printout."
        />

        <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-sea-100 bg-white p-6 shadow-soft sm:p-8">
          <label htmlFor="code" className="block text-sm font-semibold text-sea-800">
            Gift card code
          </label>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sea-400" />
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
              placeholder="e.g. CROATIA7X4P"
              className="input-field pl-11 tracking-[0.2em] uppercase"
              maxLength={12}
            />
          </div>
          <button onClick={lookup} disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? 'Checking...' : 'Check balance'}
          </button>

          {error && (
            <div className="mt-5 rounded-xl border border-terracotta-200 bg-terracotta-50 p-4 text-sm text-terracotta-800">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-6 rounded-2xl border border-sea-200 bg-sea-gradient p-6">
              <div className="flex items-center gap-2 text-olive-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-semibold">Card found</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-sea-500">Remaining balance</p>
                  <p className="mt-1 font-display text-4xl font-semibold text-sea-950">
                    {formatEuro(result.balance_eur)}
                  </p>
                </div>
                <span className={`chip ${
                  result.status === 'redeemed'
                    ? 'bg-sea-100 text-sea-700'
                    : result.status === 'expired'
                    ? 'bg-terracotta-100 text-terracotta-700'
                    : 'bg-olive-100 text-olive-700'
                }`}>
                  <Wallet className="h-3.5 w-3.5" /> {result.status}
                </span>
              </div>
              <dl className="mt-6 space-y-2 border-t border-sea-100 pt-4 text-sm text-sea-700">
                <div className="flex justify-between">
                  <dt className="text-sea-500">Original amount</dt>
                  <dd className="font-medium">{formatEuro(result.amount_eur)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sea-500">Recipient</dt>
                  <dd className="font-medium">{result.recipient_name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sea-500">Issued</dt>
                  <dd className="font-medium">{formatDate(result.created_at)}</dd>
                </div>
                {result.delivery_date && (
                  <div className="flex justify-between">
                    <dt className="text-sea-500">Delivers</dt>
                    <dd className="font-medium">{formatDate(result.delivery_date)}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
