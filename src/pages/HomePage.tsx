import { useMemo } from 'react';
import { ArrowRight, Gift, Shield, Sparkles, Wallet } from 'lucide-react';
import { Link } from '@/lib/router';
import { useAsync } from '@/lib/useAsync';
import { fetchCities, fetchFeaturedVenues } from '@/lib/queries';
import { CATEGORY_META, CATEGORY_ORDER } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import CityCard from '@/components/CityCard';
import VenueCard from '@/components/VenueCard';
import SectionHeader from '@/components/SectionHeader';

export default function HomePage() {
  const cities = useAsync(fetchCities, []);
  const venues = useAsync(fetchFeaturedVenues, [6]);

  const heroCity = useMemo(
    () => cities.data?.find((c) => c.slug === 'dubrovnik') ?? cities.data?.[0],
    [cities.data],
  );

  return (
    <div>
      {/* Hero */}
      <section className="relative -mt-16 min-h-[100svh] overflow-hidden">
        {heroCity && (
          <img
            src={heroCity.image_url}
            alt={heroCity.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-hero-overlay" />
        <div className="absolute inset-0 bg-gradient-to-r from-sea-950/55 via-sea-950/25 to-transparent" />

        <div className="relative container-page flex min-h-[100svh] flex-col justify-end pb-20 pt-32">
          <div className="max-w-2xl animate-fade-up text-white">
            <span className="chip border border-white/30 bg-white/10 text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" /> {cities.data?.length ?? 'Croatian'} destinations · {CATEGORY_ORDER.length} experience categories
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] sm:text-6xl lg:text-7xl">
              The taste of Croatia,<br /> wrapped in a gift card.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-sea-100/90">
              Give the Adriatic's best — dinners at TripAdvisor-top tables, sail
              days to hidden islands, spa mornings above the sea, and cellar
              tastings in Istria and Pelješac.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/create" className="btn-primary">
                Create a gift card <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/experiences"
                className="btn-ghost border-white/40 bg-white/10 text-white hover:border-white hover:bg-white/20 hover:text-white"
              >
                Browse experiences
              </Link>
            </div>
          </div>

          <div className="mt-12 hidden gap-3 sm:flex">
            {['Dubrovnik', 'Split', 'Zagreb', 'Rovinj', 'Hvar'].map((name, i) => (
              <Link
                key={name}
                to={`/city/${name.toLowerCase()}`}
                className="chip border border-white/25 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/25"
              >
                <span className="opacity-50">{i + 1}</span> {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Intro band */}
      <section className="container-page -mt-10">
        <div className="grid gap-4 rounded-3xl border border-sea-100 bg-white p-6 shadow-card sm:grid-cols-3 sm:p-8">
          {[
            { icon: Gift, title: 'One card, any city', text: 'Explore experiences across Croatian destinations.' },
            { icon: Wallet, title: 'Flexible amounts', text: 'Start from €25 or fund a complete getaway. Recipient decides where to spend.' },
            { icon: Shield, title: 'Secure & trackable', text: 'Each card has a unique code and live balance — no paper to lose.' },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sea-100 text-sea-700">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-sea-950">{item.title}</h3>
                <p className="mt-1 text-sm text-sea-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cities grid */}
      <section className="container-page mt-24">
        <SectionHeader
          eyebrow="Where to go"
          title={`${cities.data?.length ?? 'Croatian'} Croatian destinations, waiting`}
          subtitle="From the walled Pearl of the Adriatic to the lavender hills of Hvar. Pick a city, then pick your experience."
        />
        {cities.loading ? (
          <GridSkeleton />
        ) : cities.error ? (
          <ErrorBox message={cities.error} />
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {cities.data?.slice(0, 12).map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link to="/cities" className="btn-ghost">
            See all {cities.data?.length ?? 'Croatian'} destinations <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Experiences band */}
      <section className="container-page mt-24">
        <SectionHeader
          eyebrow="What to do"
          title="Ways to spoil someone"
          subtitle="Every gift card spends across dining, stays, spa, sailing, wine, parks, and local finds — all hand-picked."
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORY_ORDER.map((cat) => {
            const meta = CATEGORY_META[cat];
            return (
              <Link
                key={cat}
                to={`/experiences/${cat}`}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-sea-100 bg-white p-5 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-sea-300 hover:shadow-card"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-600 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                  <CategoryIcon category={cat} className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold text-sea-950">{meta.label}</h3>
                  <p className="mt-1 text-sm text-sea-600">{meta.blurb}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-terracotta-500 transition-colors group-hover:text-terracotta-600">
                  Explore {meta.shortLabel.toLowerCase()} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured venues */}
      <section className="container-page mt-24">
        <SectionHeader
          eyebrow="Editor's picks"
          title="Featured experiences"
          subtitle="The very best of the Adriatic, hand-picked from the top-rated tables, stays, and sails."
        />
        {venues.loading ? (
          <GridSkeleton />
        ) : venues.error ? (
          <ErrorBox message={venues.error} />
        ) : (
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {venues.data?.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="container-page mt-24">
        <div className="overflow-hidden rounded-3xl bg-sea-950 px-6 py-16 text-white sm:px-12">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-300">
                How it works
              </span>
              <h2 className="mt-3 font-display text-4xl font-semibold leading-tight">
                A gift card in<br /> three easy steps.
              </h2>
              <p className="mt-4 max-w-md text-sea-200">
                No paper, no expiry headaches. You build the gift; they pick the
                memories.
              </p>
              <Link to="/how-it-works" className="btn-primary mt-8">
                See the details <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ol className="grid gap-4">
              {[
                { n: '01', t: 'Pick a city & experience', d: 'Choose from Croatian destinations and experience categories — or let the recipient decide later.' },
                { n: '02', t: 'Set the amount & message', d: 'From €25 to a full week getaway. Add a personal note and delivery date.' },
                { n: '03', t: 'Send instantly or schedule', d: 'They receive a beautiful digital card with a unique code to redeem anywhere.' },
              ].map((step) => (
                <li key={step.n} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <span className="font-display text-3xl font-semibold text-terracotta-300">{step.n}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">{step.t}</h3>
                    <p className="mt-1 text-sm text-sea-200">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-terracotta-500 px-6 py-16 text-center text-white sm:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-terracotta-700/40" />
          <div className="relative">
            <h2 className="font-display text-4xl font-semibold sm:text-5xl">
              Ready to gift the Adriatic?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-terracotta-50/90">
              Build a gift card in under two minutes. The hardest part is choosing
              the city.
            </p>
            <Link to="/create" className="btn-ghost mt-8 border-white/40 bg-white text-terracotta-600 hover:bg-terracotta-50">
              Start building <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-sea-100" />
      ))}
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="mt-12 rounded-2xl border border-terracotta-200 bg-terracotta-50 p-6 text-center text-terracotta-800">
      {message}
    </div>
  );
}
