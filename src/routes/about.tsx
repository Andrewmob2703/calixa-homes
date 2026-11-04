import { createFileRoute, Link } from "@tanstack/react-router";
import { Target, Eye, HeartHandshake } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import globe from "@/assets/globe-global-people.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — CalixaHomes" },
      { name: "description", content: "CalixaHomes helps Africans abroad build homes back home with trusted materials, site delivery and live progress tracking." },
      { property: "og:title", content: "About Us — CalixaHomes" },
      { property: "og:description", content: "Our mission: make building in Africa from abroad simple, transparent and stress-free." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const pillars = [
  { icon: Target, t: "Our mission", d: "Give every African abroad a reliable way to buy materials and build at home without being cheated or kept in the dark." },
  { icon: Eye, t: "Our vision", d: "A future where distance is no barrier to owning a well-built home in your home country." },
  { icon: HeartHandshake, t: "Our promise", d: "Verified suppliers, honest prices, photo-confirmed deliveries and regular progress updates on every project." },
];

function About() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6"><SiteNav /></div>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">About CalixaHomes</p>
        <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-tight md:text-6xl">We help you build back home, the Calixa way.</h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">Too many people abroad send money home for a house and get excuses, missing materials or unfinished walls. CalixaHomes was started to change that. You order the materials, we deliver them to your site, and you see every step until your keys are in hand.</p>
      </section>
      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-secondary px-6 pb-10 pt-8">
          <img src={globe} alt="People across the world using the CalixaHomes app on their phones, connected to a build in Africa" loading="lazy" width={827} height={814} className="mx-auto block h-auto max-h-[40rem] w-full object-contain" />
          <p className="mx-auto max-w-xl pt-6 text-center text-lg text-secondary-foreground">Wherever you are in the world, CalixaHomes reaches your building site back home.</p>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-6 px-6 py-24 md:grid-cols-3">
        {pillars.map(({ icon: I, t, d }) => (
          <div key={t} className="rounded-2xl bg-card p-7 shadow-sm">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary"><I className="h-6 w-6 text-primary-foreground" /></div>
            <h2 className="mt-5 text-2xl font-bold">{t}</h2>
            <p className="mt-2 text-muted-foreground">{d}</p>
          </div>
        ))}
      </section>
      <section className="bg-muted py-20 text-center">
        <h2 className="mx-auto max-w-2xl px-6 text-4xl font-extrabold">Ready to start your build?</h2>
        <Link to="/contact" className="mt-8 inline-block rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-glow">Talk to us</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
