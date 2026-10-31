import { useState } from 'react';
import { Search } from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchCities } from '@/lib/queries';
import CityCard from '@/components/CityCard';
import SectionHeader from '@/components/SectionHeader';

export default function CitiesPage() {
  const cities = useAsync(fetchCities, []);
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState<string>('All');

  const regions = ['All', ...Array.from(new Set((cities.data ?? []).map((c) => c.region))).sort()];

  const filtered = (cities.data ?? []).filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.short_description.toLowerCase().includes(query.toLowerCase());
    const matchesRegion = region === 'All' || c.region === region;
    return matchesQuery && matchesRegion;
  });

  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <SectionHeader
          eyebrow="Where to go"
          title={cities.data ? `All ${cities.data.length} Croatian destinations` : 'Croatian destinations'}
          subtitle="Browse the full map of Croatian destinations. Tap any city to explore its restaurants, stays, sailing days, and more."
        />

        <div className="mx-auto mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sea-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a city or keyword..."
              className="input-field pl-11"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRegion(r)}
                className={`chip cursor-pointer border transition-colors ${
                  region === r
                    ? 'border-sea-500 bg-sea-500 text-white'
                    : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {cities.loading ? (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-sea-100" />
            ))}
          </div>
        ) : cities.error ? (
          <div className="mt-12 rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6 text-center text-terracotta-800">
            {cities.error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-sea-200 bg-white p-12 text-center text-sea-600">
            No cities match "{query}". Try another name or region.
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
