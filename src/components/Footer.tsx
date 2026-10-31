import { Gift, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from '@/lib/router';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-sea-100 bg-sea-950 text-sea-100">
      <div className="container-page grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-500 text-white">
              <Gift className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold text-white">
              Croatia Gifts
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-sea-200">
            Gift cards for Croatia's best restaurants, hotels, spas, boat trips,
            and wineries — across Croatia from Zagreb to Dubrovnik.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-sea-200">
            <a href="mailto:hello@croatiagifts.com" className="inline-flex items-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" /> hello@croatiagifts.com
            </a>
            <span className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" /> +385 1 555 0142
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Zagreb, Croatia
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sea-300">
            Explore
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/cities" className="hover:text-white">Cities</Link></li>
            <li><Link to="/experiences" className="hover:text-white">Experiences</Link></li>
            <li><Link to="/how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link to="/balance" className="hover:text-white">Check balance</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-sea-300">
            Top cities
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/city/dubrovnik" className="hover:text-white">Dubrovnik</Link></li>
            <li><Link to="/city/split" className="hover:text-white">Split</Link></li>
            <li><Link to="/city/zagreb" className="hover:text-white">Zagreb</Link></li>
            <li><Link to="/city/rovinj" className="hover:text-white">Rovinj</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sea-800/60">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-sea-300 sm:flex-row">
          <span>© {new Date().getFullYear()} Croatia Gifts. Made on the Adriatic coast.</span>
          <span>Real, license-free photography from Pexels contributors.</span>
        </div>
      </div>
    </footer>
  );
}
