import { useEffect, useState } from 'react';
import { Gift, Menu, X } from 'lucide-react';
import { Link, useRouter } from '@/lib/router';

const NAV_LINKS = [
  { label: 'Cities', to: '/cities' },
  { label: 'Experiences', to: '/experiences' },
  { label: 'Events', to: '/events' },
  { label: 'How it works', to: '/how-it-works' },
  { label: 'Check balance', to: '/balance' },
];

export default function Navbar() {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [path]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-sea-100 bg-ivory-50/95 backdrop-blur-md shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500 text-white shadow-soft">
            <Gift className="h-5 w-5" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-lg font-semibold text-sea-950">
              Croatia Gifts
            </span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-sea-500">
              Experiences of the Adriatic
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              path === link.to ||
              (link.to !== '/' && path.startsWith(link.to + '/'));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-sea-100 text-sea-900'
                    : 'text-sea-700 hover:bg-sea-50 hover:text-sea-950'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link to="/create" className="btn-primary ml-2">
            Create gift card
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-sea-200 bg-white/80 text-sea-800 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="border-t border-sea-100 bg-ivory-50/98 backdrop-blur-md md:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl px-4 py-3 text-sm font-medium text-sea-800 hover:bg-sea-50"
              >
                {link.label}
              </Link>
            ))}
            <Link to="/create" className="btn-primary mt-2 w-full">
              Create gift card
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
