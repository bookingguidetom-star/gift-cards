import {
  Wine,
  Utensils,
  Trees,
  Landmark,
  Palette,
  ShoppingBag,
  Sparkles,
  type LucideIcon,
} from 'lucide-react';
import type { Specialty } from '@/lib/types';

const SPECIALTY_ICON: Record<string, LucideIcon> = {
  wine: Wine,
  food: Utensils,
  nature: Trees,
  heritage: Landmark,
  culture: Palette,
  craft: ShoppingBag,
};

const SPECIALTY_COLOR: Record<string, string> = {
  wine: 'bg-terracotta-50 text-terracotta-700 ring-terracotta-200',
  food: 'bg-amber-50 text-amber-700 ring-amber-200',
  nature: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  heritage: 'bg-sea-50 text-sea-700 ring-sea-200',
  culture: 'bg-violet-50 text-violet-700 ring-violet-200',
  craft: 'bg-stone-100 text-stone-700 ring-stone-300',
};

function iconFor(type: string): LucideIcon {
  return SPECIALTY_ICON[type] ?? Sparkles;
}

function colorFor(type: string): string {
  return SPECIALTY_COLOR[type] ?? 'bg-sea-50 text-sea-700 ring-sea-200';
}

export default function SpecialtiesSection({
  cityName,
  specialties,
}: {
  cityName: string;
  specialties: Specialty[];
}) {
  if (!specialties || specialties.length === 0) return null;

  return (
    <section className="container-page mt-14">
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-terracotta-600">
          Local Specialties
        </span>
        <h2 className="mt-1 font-display text-3xl font-semibold text-sea-950">
          What {cityName} is known for
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-sea-600">
          The signature products, dishes, wines, and traditions that define this region of Croatia.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specialties.map((s) => {
          const Icon = iconFor(s.type);
          return (
            <div
              key={s.name}
              className="group rounded-2xl border border-sea-100 bg-white p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-soft"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${colorFor(
                    s.type,
                  )} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-semibold text-sea-950">
                    {s.name}
                  </h3>
                  <span className="text-[11px] font-medium uppercase tracking-wider text-sea-400">
                    {s.type}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-sea-600">
                {s.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
