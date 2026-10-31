import { MapPin } from 'lucide-react';
import { Link } from '@/lib/router';
import type { City } from '@/lib/types';

export default function CityCard({ city }: { city: City }) {
  return (
    <Link
      to={`/city/${city.slug}`}
      className="group relative block overflow-hidden rounded-2xl shadow-soft transition-all duration-500 hover:-translate-y-1.5 hover:shadow-card"
    >
      <div className="aspect-[4/5] w-full overflow-hidden">
        <img
          src={city.image_url}
          alt={city.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-sea-950/90 via-sea-950/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
        <span className="chip bg-white/15 text-white backdrop-blur-sm">
          <MapPin className="h-3 w-3" /> {city.region}
        </span>
        <h3 className="mt-3 font-display text-2xl font-semibold">{city.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-sea-100/90">
          {city.short_description}
        </p>
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-terracotta-300 transition-colors group-hover:text-terracotta-200">
          Explore experiences →
        </span>
      </div>
    </Link>
  );
}
