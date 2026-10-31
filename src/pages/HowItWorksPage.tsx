import { ArrowRight, Calendar, Gift, Mail, Wallet } from 'lucide-react';
import { Link } from '@/lib/router';
import SectionHeader from '@/components/SectionHeader';

export default function HowItWorksPage() {
  return (
    <div className="pt-20">
      <section className="container-page mt-12">
        <SectionHeader
          eyebrow="How it works"
          title="Gift the Adriatic in minutes"
          subtitle="A gift card that lets the recipient pick the experience across Croatian destinations and categories."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {[
            { icon: Gift, t: '1. Pick a city & experience', d: 'Browse Croatian destinations and categories. Lock the gift card to a city and venue, or leave it open for the recipient to decide.' },
            { icon: Wallet, t: '2. Set the amount & message', d: 'Choose a preset (€25 – €200) or enter a custom amount. Add a personal note, the recipient name, and delivery date.' },
            { icon: Mail, t: '3. Send instantly or schedule', d: 'They receive a beautifully designed digital card with a unique code. Forward it by email, or print the code to hand over in person.' },
          ].map((step) => (
            <div key={step.t} className="rounded-2xl border border-sea-100 bg-white p-8 shadow-soft">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sea-100 text-sea-700">
                <step.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-sea-950">{step.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-sea-600">{step.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Redeem steps */}
      <section className="container-page mt-24">
        <SectionHeader
          eyebrow="For recipients"
          title="How to redeem"
          subtitle="No app to install — just present the code at the venue, or use the in-app balance checker to track spending."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Calendar, t: 'Reserve', d: 'Book a table, room, spa slot, or boat directly with the venue as you normally would.' },
            { icon: Gift, t: 'Present the code', d: 'Show your gift card code at the venue — they apply the balance toward your experience.' },
            { icon: Wallet, t: 'Track the balance', d: 'Use the in-app balance checker anytime to see remaining balance and status.' },
          ].map((step) => (
            <div key={step.t} className="flex gap-4 rounded-2xl border border-sea-100 bg-ivory-100 p-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-500 text-white">
                <step.icon className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold text-sea-950">{step.t}</h3>
                <p className="mt-1 text-sm text-sea-600">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container-page mt-24">
        <SectionHeader
          eyebrow="Questions"
          title="Good to know"
          subtitle="Everything a gift card sender and recipient should know up front."
        />
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {FAQ.map((item) => (
            <details key={item.q} className="group rounded-2xl border border-sea-100 bg-white p-5 shadow-soft">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold text-sea-950">
                {item.q}
                <span className="text-terracotta-500 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-sea-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-page mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-terracotta-500 px-6 py-16 text-center text-white sm:px-12">
          <h2 className="font-display text-4xl font-semibold">Build a gift card now</h2>
          <p className="mx-auto mt-3 max-w-xl text-terracotta-50/90">Takes under two minutes.</p>
          <Link to="/create" className="btn-ghost mt-8 border-white/40 bg-white text-terracotta-600 hover:bg-terracotta-50">
            Get started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

const FAQ = [
  {
    q: 'Does the gift card expire?',
    a: 'Croatia Gifts cards are valid for 12 months from the purchase date. The balance checker always shows the current status.',
  },
  {
    q: 'Can the recipient spend across multiple venues?',
    a: 'Yes. The balance can be redeemed at any participating venue up to the card amount. Some cards are also restricted to a single city or venue if you choose that option at creation.',
  },
  {
    q: 'How is the card delivered?',
    a: 'The digital card is sent to the recipient email you provide. You can send instantly or schedule for a future date. The unique 12-character code can be shown on a phone or printed.',
  },
  {
    q: 'What happens if a venue does not accept the card?',
    a: 'All venues featured in Croatia Gifts have agreed to accept gift card codes. If you ever have trouble, contact support with your card code and we will resolve it.',
  },
  {
    q: 'Is this a real purchase or a demo?',
    a: 'This build creates a real gift card record with a tracked balance. Live card payments are not yet enabled — cards are created in a "demo" status for now. You can check the balance and status using the balance checker.',
  },
];
