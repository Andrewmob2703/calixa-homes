import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe, ShieldCheck, Eye } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ServiceSlideshow } from "@/components/ServiceSlideshow";
import { landingImages } from "@/components/service-images";
import buildImg from "@/assets/calixa-build-branded-delivery.jpg";
import careImg from "@/assets/calixa-care-plumbing.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CalixaHomes — Build The Calixa Way" },
      { name: "description", content: "CalixaHomes helps Africans abroad build and maintain their homes back home: order and track building materials, or book trusted house-maintenance professionals." },
      { property: "og:title", content: "CalixaHomes — Build The Calixa Way" },
      { property: "og:description", content: "Build your home with Calixa Build. Care for it with Calixa Care. All from anywhere in the world." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const services = [
  { to: "/build" as const, name: "Calixa Build", tag: "Build your home", img: buildImg, alt: "Cement and iron rods delivered to a house under construction", d: "Order cement, iron rods, blocks and more. We deliver to your site and you follow every stage of construction until handover." },
  { to: "/care" as const, name: "Calixa Care", tag: "Care for your home", img: careImg, alt: "CalixaHomes plumber maintaining a kitchen sink", d: "Keep your house in great shape with verified plumbers, electricians, gardeners, cleaners, painters and repair professionals." },
];

function Landing() {
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <ServiceSlideshow images={landingImages} label="CalixaHomes Build and Care photos" />
        <div className="pointer-events-none absolute inset-0 bg-hero-overlay" />
        <div className="pointer-events-none relative mx-auto max-w-6xl px-6 pb-20 [&_nav]:pointer-events-auto">
          <SiteNav light getStartedSource="landing_get_started" />
          <div className="pt-14 text-secondary-foreground">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Welcome to CalixaHomes</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Your home back home, handled.</h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">Whether you're building from the ground up or looking after the house your family lives in, CalixaHomes gives you trusted people on the ground — wherever in the world you are.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-center text-4xl font-extrabold md:text-5xl">Two services. One trusted partner.</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {services.map((s) => (
            <Link key={s.to} to={s.to} className="group relative block min-h-[26rem] overflow-hidden rounded-3xl shadow-glow">
              <img src={s.img} alt={s.alt} loading="lazy" width={1280} height={832} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-hero-overlay" />
              <div className="relative flex h-full min-h-[26rem] flex-col justify-end p-8 text-secondary-foreground">
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">{s.tag}</p>
                <h3 className="mt-2 text-4xl font-extrabold">{s.name}</h3>
                <p className="mt-3 max-w-md opacity-90">{s.d}</p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground">Explore {s.name} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-16 text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Verified people", d: "Suppliers, builders and home pros are screened by us." },
            { icon: Eye, t: "Full visibility", d: "Photo updates for every delivery, milestone and visit." },
            { icon: Globe, t: "Built for the diaspora", d: "Manage everything and pay from wherever you live." },
          ].map(({ icon: I, t, d }) => (
            <div key={t} className="rounded-2xl bg-secondary-foreground/10 p-6">
              <I className="h-8 w-8 text-primary" />
              <h3 className="mt-4 font-bold">{t}</h3>
              <p className="mt-2 text-sm opacity-80">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
