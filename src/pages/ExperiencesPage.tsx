import { ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router';
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import SectionHeader from '@/components/SectionHeader';
import { useAsync } from '@/lib/useAsync';
import { fetchVenuesByCategory, fetchCities } from '@/lib/queries';
import VenueCard from '@/components/VenueCard';
import { useState } from 'react';

export default function ExperiencesPage() {
  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <SectionHeader
          eyebrow="What to do"
          title="Experiences worth gifting"
          subtitle="Explore experiences across Croatian destinations. Pick a category to dive in."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_ORDER.map((cat) => (
            <Link
              key={cat}
              to={`/experiences/${cat}`}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-sea-100 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sea-300 hover:shadow-card"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-50 text-terracotta-600 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                <CategoryIcon category={cat} className="h-7 w-7" />
              </span>
              <div className="mt-6">
                <h3 className="font-display text-xl font-semibold text-sea-950">{CATEGORY_META[cat].label}</h3>
                <p className="mt-2 text-sm leading-relaxed text-sea-600">{CATEGORY_META[cat].blurb}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-terracotta-500">
                Explore {CATEGORY_META[cat].shortLabel.toLowerCase()} <ArrowRight className="h-3 w-3" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function ExperienceCategoryPage({ category }: { category: string }) {
  const cat = CATEGORY_ORDER.includes(category as typeof CATEGORY_ORDER[number])
    ? (category as typeof CATEGORY_ORDER[number])
    : null;

  const venues = useAsync(() => (cat ? fetchVenuesByCategory(cat, 48) : Promise.resolve([])), [category]);
  const cities = useAsync(fetchCities, []);

  const [cityFilter, setCityFilter] = useState<string>('all');

  if (!cat) {
    return (
      <div className="pt-32 container-page">
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-12 text-center text-terracotta-800">
          Unknown experience category.
        </div>
      </div>
    );
  }

  const meta = CATEGORY_META[cat];

  const filteredVenues = (venues.data ?? []).filter((v) => cityFilter === 'all' || v.city_id === cityFilter);

  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <div className="flex flex-col items-start gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-50 text-terracotta-600">
            <CategoryIcon category={cat} className="h-7 w-7" />
          </span>
          <div>
            <Link to="/experiences" className="text-sm text-sea-500 hover:text-sea-800">← All experiences</Link>
            <h1 className="mt-2 font-display text-4xl font-semibold text-sea-950 sm:text-5xl">{meta.label}</h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-sea-600">{meta.blurb}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCityFilter('all')}
            className={`chip cursor-pointer border transition-colors ${
              cityFilter === 'all'
                ? 'border-sea-500 bg-sea-500 text-white'
                : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
            }`}
          >
            All cities
          </button>
          {(cities.data ?? []).map((c) => {
            const has = (venues.data ?? []).some((v) => v.city_id === c.id);
            if (!has) return null;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setCityFilter(c.id)}
                className={`chip cursor-pointer border transition-colors ${
                  cityFilter === c.id
                    ? 'border-sea-500 bg-sea-500 text-white'
                    : 'border-sea-200 bg-white text-sea-700 hover:border-sea-400'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>

        {venues.loading ? (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl bg-sea-100" />
            ))}
          </div>
        ) : venues.error ? (
          <div className="mt-12 rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6 text-center text-terracotta-800">
            {venues.error}
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-sea-200 bg-white p-12 text-center text-sea-600">
            No {meta.label.toLowerCase()} in this city yet.
          </div>
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
