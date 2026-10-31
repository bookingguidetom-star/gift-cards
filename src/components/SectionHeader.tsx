import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  children?: ReactNode;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  centered = true,
  children,
}: SectionHeaderProps) {
  return (
    <div className={`max-w-2xl ${centered ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-terracotta-500">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 font-display text-3xl font-semibold leading-tight text-sea-950 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-base leading-relaxed text-sea-600">{subtitle}</p>
      )}
      {children}
    </div>
  );
}
