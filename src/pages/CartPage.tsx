import { useMemo, useState } from 'react';
import { MapPin, ChevronDown, ChevronRight } from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchCities } from '@/lib/queries';
import { Link } from '@/lib/router';
import type { City } from '@/lib/types';

export default function CartPage() {
  const cities = useAsync(fetchCities, []);
  const [expanded, setExpanded] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, City[]>();
    for (const city of cities.data ?? []) {
      const list = map.get(city.region) ?? [];
      list.push(city);
      map.set(city.region, list);
    }
    const allRegions = ALL_REGIONS.filter((r) => map.has(r));
    return allRegions.map((region) => ({
      region,
      cities: (map.get(region) ?? []).sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [cities.data]);

  const totalCities = cities.data?.length ?? 0;
  const populatedCount = grouped.length;

  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <div className="max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">
            Regional directory
          </span>
          <h1 className="mt-2 font-display text-4xl font-semibold text-sea-950 sm:text-5xl">
            The Cart of Croatia
          </h1>
          <p className="mt-3 text-base leading-relaxed text-sea-600">
            All {totalCities} destinations organized across Croatia's {populatedCount} counties — from the Adriatic coast to the Slavonian plains. Tap a region to reveal its cities.
          </p>
        </div>

        {cities.loading ? (
          <div className="mt-10 space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-sea-100" />
            ))}
          </div>
        ) : cities.error ? (
          <div className="mt-10 rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6 text-center text-terracotta-800">
            {cities.error}
          </div>
        ) : (
          <div className="mt-10 space-y-3">
            {grouped.map(({ region, cities: regionCities }) => {
              const isOpen = expanded === region;
              const isFeatured = FEATURED_REGIONS.includes(region);

              return (
                <div
                  key={region}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? 'border-sea-300 shadow-soft'
                      : 'border-sea-100 hover:border-sea-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : region)}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                          isFeatured
                            ? 'bg-terracotta-500 text-white'
                            : 'bg-sea-100 text-sea-700'
                        }`}
                      >
                        {regionCities.length}
                      </span>
                      <div>
                        <h2 className="font-display text-lg font-semibold text-sea-950">
                          {region}
                        </h2>
                        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-sea-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {regionCities.length} {regionCities.length === 1 ? 'city' : 'cities'}
                        </p>
                      </div>
                    </div>
                    <span className="shrink-0 text-sea-400">
                      {isOpen ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-sea-100 p-4">
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {regionCities.map((city) => (
                          <Link
                            key={city.id}
                            to={`/city/${city.slug}`}
                            className="group flex items-center gap-3 rounded-xl border border-sea-100 bg-ivory-50/50 p-3 transition-all duration-300 hover:border-sea-300 hover:bg-white hover:shadow-soft"
                          >
                            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                              <img
                                src={city.image_url}
                                alt={city.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-sea-950">
                                {city.name}
                              </p>
                              <p className="mt-0.5 line-clamp-1 text-xs text-sea-500">
                                {city.short_description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {grouped.length === 0 && (
              <div className="rounded-2xl border border-sea-200 bg-white p-12 text-center text-sea-600">
                No cities found.
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-xs text-sea-400">
          Croatia has 21 administrative regions: 20 counties (županije) and the City of Zagreb. {populatedCount} of them have destinations on Croatia Gifts.
        </p>
      </section>
    </div>
  );
}

const ALL_REGIONS = [
  'City of Zagreb',
  'Zagreb County',
  'Split-Dalmatia County',
  'Dubrovnik-Neretva County',
  'Istria County',
  'Primorje-Gorski Kotar County',
  'Lika-Senj County',
  'Zadar County',
  'Šibenik-Knin County',
  'Osijek-Baranja County',
  'Varaždin County',
  'Krapina-Zagorje County',
  'Sisak-Moslavina County',
  'Karlovac County',
  'Bjelovar-Bilogora County',
  'Virovita-Podravina County',
  'Požega-Slavonia County',
  'Brod-Posavina County',
  'Vukovar-Syrmia County',
  'Međimurje County',
  'Koprivnica-Križevci County',
];

const FEATURED_REGIONS = [
  'City of Zagreb',
  'Split-Dalmatia County',
  'Dubrovnik-Neretva County',
  'Istria County',
];
