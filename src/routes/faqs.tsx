import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { AppStoreBadges } from "@/components/AppStoreBadges";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — CalixaHomes" },
      { name: "description", content: "Answers about ordering building materials, site delivery, payments and construction tracking with CalixaHomes." },
      { property: "og:title", content: "FAQs — CalixaHomes" },
      { property: "og:description", content: "Common questions about building in Africa from abroad with CalixaHomes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Faqs,
});

const faqs = [
  { q: "What is CalixaHomes?", a: "A platform that lets Africans living abroad order building materials, have them delivered to their construction site and follow the build until it's finished." },
  { q: "Which materials can I order?", a: "Cement, iron rods, concrete blocks, sand and gravel, roofing sheets, tiles, plumbing and electrical supplies, and more." },
  { q: "Who receives the materials on site?", a: "You choose: a trusted relative, your foreman, or one of our site agents. Every delivery is confirmed with photos and the recipient's name." },
  { q: "How do I pay?", a: "You pay securely by card from anywhere in the world, in your own currency." },
  { q: "How long does delivery take?", a: "Most orders arrive on site within a few days, depending on the location and the materials." },
  { q: "How do I track my construction?", a: "Your project page shows each stage, from foundation to roofing to finishing, with regular photo updates." },
  { q: "Which countries do you serve?", a: "We are starting in Ghana and growing across Africa. Contact us to check your site's location." },
];

function Faqs() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6"><SiteNav /></div>
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-center text-5xl font-extrabold">Frequently asked questions</h1>
        <p className="mt-4 text-center text-muted-foreground">Everything you need to know about building the Calixa way.</p>
        <div className="mt-12 space-y-4">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-card p-6 shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-bold">
                {f.q}<span className="text-2xl text-accent transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="bg-muted py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Coming soon</p>
        <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">Get the CalixaHomes app</h2>
        <p className="mx-auto mt-4 max-w-xl px-6 text-muted-foreground">Order materials, book house pros and follow your project from your phone. Tap a store below to be told the day it launches — or contact us to start today.</p>
        <AppStoreBadges className="mt-8 justify-center" source="faqs_app_store" />
      </section>
      <SiteFooter />
    </main>
  );
}
