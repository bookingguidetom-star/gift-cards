import { useMemo, useState } from 'react';
import { ArrowLeft, ExternalLink, MapPin } from 'lucide-react';
import { useAsync } from '@/lib/useAsync';
import { fetchCityWithVenues } from '@/lib/queries';
import { CATEGORY_META, CATEGORY_ORDER, type VenueCategory } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import { Link, useRouter } from '@/lib/router';
import VenueCard from '@/components/VenueCard';
import SpecialtiesSection from '@/components/SpecialtiesSection';
import EventsSection from '@/components/EventsSection';
import WeatherForecast from '@/components/WeatherForecast';

export default function CityDetailPage({ slug }: { slug: string }) {
  const { navigate } = useRouter();
  const city = useAsync(() => fetchCityWithVenues(slug), [slug]);
  const [activeCategory, setActiveCategory] = useState<VenueCategory | 'all'>('all');

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    city.data?.venues.forEach((v) => {
      map[v.category] = (map[v.category] ?? 0) + 1;
    });
    return map;
  }, [city.data]);

  const visibleVenues = useMemo(() => {
    if (!city.data) return [];
    if (activeCategory === 'all') return city.data.venues;
    return city.data.venues.filter((v) => v.category === activeCategory);
  }, [city.data, activeCategory]);

  const availableCategories = CATEGORY_ORDER.filter((c) => (counts[c] ?? 0) > 0);

  if (city.loading) {
    return (
      <div className="pt-32 container-page">
        <div className="aspect-[21/9] animate-pulse rounded-3xl bg-sea-100" />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[16/10] animate-pulse rounded-2xl bg-sea-100" />
          ))}
        </div>
      </div>
    );
  }

  if (city.error || !city.data) {
    return (
      <div className="pt-32 container-page">
        <div className="rounded-2xl border border-terracotta-200 bg-terracotta-50 p-12 text-center">
          <p className="text-terracotta-800">{city.error ?? 'City not found.'}</p>
          <button onClick={() => navigate('/cities')} className="btn-ghost mt-6">
            Back to cities
          </button>
        </div>
      </div>
    );
  }

  const c = city.data;

  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-16 min-h-[60svh] overflow-hidden">
        <img src={c.image_url} alt={c.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-sea-950/90 via-sea-950/40 to-sea-950/30" />
        <div className="relative container-page flex min-h-[60svh] flex-col justify-end pb-12 pt-32 text-white">
          <Link to="/cities" className="inline-flex items-center gap-2 text-sm text-sea-100/80 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All cities
          </Link>
          <div className="mt-6 max-w-3xl">
            <span className="chip border border-white/30 bg-white/10 text-white backdrop-blur-sm">
              <MapPin className="h-3.5 w-3.5" /> {c.region}
            </span>
            <h1 className="mt-4 font-display text-5xl font-semibold sm:text-6xl">{c.name}</h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-sea-100/90">{c.long_description}</p>
            {c.source_url && (
              <a
                href={c.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sea-100 underline decoration-white/40 underline-offset-4 hover:text-white"
              >
                Destination information <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Specialties */}
      {c.specialties && c.specialties.length > 0 && (
        <SpecialtiesSection cityName={c.name} specialties={c.specialties} />
      )}

      <WeatherForecast latitude={c.lat} longitude={c.lng} />

      {/* Events */}
      {c.events && c.events.length > 0 && (
        <EventsSection cityName={c.name} events={c.events} />
      )}

      {/* Category filter */}
      <section className="container-page mt-12">
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={activeCategory === 'all'}
            onClick={() => setActiveCategory('all')}
            label="All"
            count={c.venues.length}
          />
          {availableCategories.map((cat) => (
            <FilterChip
              key={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              label={CATEGORY_META[cat].label}
              count={counts[cat] ?? 0}
              icon={<CategoryIcon category={cat} className="h-3.5 w-3.5" />}
            />
          ))}
        </div>
      </section>

      {/* Venues grid */}
      <section className="container-page mt-10">
        {visibleVenues.length === 0 ? (
          <div className="rounded-2xl border border-sea-200 bg-white p-12 text-center text-sea-600">
            No experiences in this category here yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visibleVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="container-page mt-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-sea-100 bg-ivory-100 p-8 sm:flex-row">
          <div>
            <h2 className="font-display text-2xl font-semibold text-sea-950">
              Gift an experience in {c.name}
            </h2>
            <p className="mt-1 text-sm text-sea-600">
              Build a gift card that spends across {c.venues.length} venues in {c.name}.
            </p>
          </div>
          <Link to={`/create?city=${c.slug}`} className="btn-primary shrink-0">
            Create gift card
          </Link>
        </div>
      </section>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
  count,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
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
      <span className={`rounded-full px-1.5 text-[10px] ${active ? 'bg-white/20' : 'bg-sea-100 text-sea-600'}`}>
        {count}
      </span>
    </button>
  );
}
