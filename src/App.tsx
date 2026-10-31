import { useMemo } from 'react';
import { RouterProvider, useRouter } from '@/lib/router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import CitiesPage from '@/pages/CitiesPage';
import CityDetailPage from '@/pages/CityDetailPage';
import ExperiencesPage, { ExperienceCategoryPage } from '@/pages/ExperiencesPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import BalancePage from '@/pages/BalancePage';
import CreatePage from '@/pages/CreatePage';
import EventsCalendarPage from '@/pages/EventsCalendarPage';
import CartPage from '@/pages/CartPage';

function Routes() {
  const { path } = useRouter();

  const route = useMemo(() => {
    const clean = path.replace(/^\/+/, '').split('?')[0];
    const query = path.includes('?') ? path.split('?')[1] : '';
    const params = new URLSearchParams(query);
    const segments = clean.split('/').filter(Boolean);

    if (segments.length === 0) return { kind: 'home' as const };
    if (segments[0] === 'cities') return { kind: 'cities' as const };
    if (segments[0] === 'city' && segments[1]) return { kind: 'city' as const, slug: segments[1] };
    if (segments[0] === 'experiences' && segments[1]) return { kind: 'experience-category' as const, category: segments[1] };
    if (segments[0] === 'experiences') return { kind: 'experiences' as const };
    if (segments[0] === 'events') return { kind: 'events' as const };
    if (segments[0] === 'cart') return { kind: 'cart' as const };
    if (segments[0] === 'how-it-works') return { kind: 'how' as const };
    if (segments[0] === 'balance') return { kind: 'balance' as const };
    if (segments[0] === 'create') return { kind: 'create' as const, city: params.get('city') };
    return { kind: 'home' as const };
  }, [path]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {route.kind === 'home' && <HomePage />}
        {route.kind === 'cities' && <CitiesPage />}
        {route.kind === 'city' && <CityDetailPage slug={route.slug} />}
        {route.kind === 'experiences' && <ExperiencesPage />}
        {route.kind === 'experience-category' && <ExperienceCategoryPage category={route.category} />}
        {route.kind === 'events' && <EventsCalendarPage />}
        {route.kind === 'cart' && <CartPage />}
        {route.kind === 'how' && <HowItWorksPage />}
        {route.kind === 'balance' && <BalancePage />}
        {route.kind === 'create' && <CreatePage />}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <Routes />
    </RouterProvider>
  );
}

export default App;
