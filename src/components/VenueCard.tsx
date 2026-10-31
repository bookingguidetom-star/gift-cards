import { ExternalLink, Star, Euro } from 'lucide-react';
import type { Venue } from '@/lib/types';
import { CATEGORY_META } from '@/lib/types';
import { CategoryIcon } from '@/lib/icons';
import { formatEuro, formatRating } from '@/lib/format';

export default function VenueCard({ venue }: { venue: Venue }) {
  const meta = CATEGORY_META[venue.category];
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-sea-100 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card">
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={venue.image_url}
          alt={venue.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 chip bg-white/90 text-sea-800 backdrop-blur-sm">
          <CategoryIcon category={venue.category} className="h-3.5 w-3.5" />
          {meta.shortLabel}
          {venue.venue_type ? ` · ${venue.venue_type}` : ''}
        </span>
        {venue.featured && (
          <span className="absolute right-3 top-3 chip bg-terracotta-500 text-white">
            Featured
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-xl font-semibold leading-tight text-sea-950">
            {venue.name}
          </h3>
          {venue.rating !== null && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-bold text-sand-800">
              <Star className="h-3 w-3 fill-sand-700 text-sand-700" />
              {formatRating(venue.rating)}
            </span>
          )}
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-sea-600">
          {venue.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-sea-50 pt-4 text-xs text-sea-500">
          {venue.price_from_eur !== null && venue.price_from_eur > 0 ? (
            <span className="inline-flex items-center gap-1 font-medium text-sea-700">
              <Euro className="h-3.5 w-3.5" /> from {formatEuro(venue.price_from_eur)}
            </span>
          ) : (
            <span className="font-medium text-olive-600">
              {venue.category === 'nightlife' ? 'Check details' : 'Free entry'}
            </span>
          )}
          {venue.source_url ? (
            <a
              href={venue.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sea-500 hover:text-sea-800"
            >
              {venue.source ?? 'Source'} <ExternalLink className="h-3 w-3" />
            </a>
          ) : venue.source ? (
            <span className="text-sea-400">via {venue.source}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
