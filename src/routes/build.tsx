import { createFileRoute } from "@tanstack/react-router";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { Headset, ShieldCheck, Truck, Camera, Eye, Globe, MapPin, ShoppingCart, UserCheck, CreditCard, HardHat, Check } from "lucide-react";
import { ServiceSlideshow } from "@/components/ServiceSlideshow";
import { buildImages } from "@/components/service-images";
import delivery from "@/assets/calixa-build-branded-delivery.jpg";
import site from "@/assets/calixa-build-foundations-branded.jpg";
import { AppComingSoonDialog } from "@/components/AppComingSoonDialog";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/build")({
  head: () => ({
    meta: [
      { title: "Calixa Build — Order materials & track your build" },
      { name: "description", content: "Diaspora Africans: order cement, iron rods and blocks, get them delivered to your site and follow construction until handover." },
      { property: "og:title", content: "Calixa Build — Order materials & track your build" },
      { property: "og:description", content: "Order materials, track deliveries and watch your build progress live." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BuildPage,
});

const materials = ["Cement", "Iron Rods", "Concrete Blocks", "Sand & Gravel", "Roofing Sheets", "Tiles", "Plumbing", "Electricals"];
const appDescription = "The CalixaHomes mobile app is in development. Order building materials and track your project when it launches.";
const values = [
  { icon: Headset, t: "Dedicated Support" },
  { icon: ShieldCheck, t: "Verified Suppliers" },
  { icon: Truck, t: "Fast Site Delivery" },
  { icon: Camera, t: "Photo Proof" },
  { icon: Eye, t: "Full Transparency" },
  { icon: HardHat, t: "Home Pros on Demand" },
];
const benefits = [
  { icon: ShieldCheck, t: "Trusted local suppliers", d: "Genuine, quality-checked materials at fair local prices." },
  { icon: Truck, t: "Delivery in days", d: "Materials arrive on site with photo and recipient confirmation." },
  { icon: HardHat, t: "Track your build", d: "Weekly progress updates from foundation to roofing to handover." },
  { icon: Globe, t: "Pay from anywhere", d: "Pay securely by card in your currency, wherever you live." },
];
const steps = [
  { icon: MapPin, t: "Pick your site", d: "Choose your project country and site location." },
  { icon: ShoppingCart, t: "Order materials", d: "Browse cement, iron rods, blocks and more." },
  { icon: UserCheck, t: "Choose a recipient", d: "A trusted relative, foreman or our site agent." },
  { icon: CreditCard, t: "Pay securely", d: "Checkout by card from anywhere in the world." },
  { icon: Camera, t: "Track to completion", d: "Follow delivery and construction milestones live." },
];
const stages = [
  { t: "Foundation", p: 100 },
  { t: "Blockwork", p: 100 },
  { t: "Lintel & Columns", p: 70 },
  { t: "Roofing", p: 0 },
  { t: "Finishing", p: 0 },
];

function BuildPage() {
  return (
    <main className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative min-h-screen overflow-hidden">
        <ServiceSlideshow images={buildImages} label="Calixa Build photos" controlsClassName="bottom-20" />
        <div className="pointer-events-none absolute inset-0 bg-hero-overlay" />
        <div className="pointer-events-none relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 [&_nav]:pointer-events-auto [&_button]:pointer-events-auto">
          <SiteNav light getStartedHash="get-the-app" />
          <div className="flex flex-1 flex-col justify-center pb-24 text-secondary-foreground">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Build The Calixa Way</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Build back home,<br />without the stress.</h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">Order cement, iron rods and building materials from anywhere in the world. We deliver to your site and keep you updated until your house is done.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <AppComingSoonDialog source="build_start_ordering" description={appDescription}>
                <Button className="h-auto rounded-full px-7 py-3 font-bold shadow-glow">Start Ordering</Button>
              </AppComingSoonDialog>
              <AppComingSoonDialog source="build_track_project" description={appDescription}>
                <Button variant="outline" className="h-auto rounded-full border-secondary-foreground/40 bg-transparent px-7 py-3 font-bold text-secondary-foreground">Track a Project</Button>
              </AppComingSoonDialog>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full overflow-hidden border-t border-secondary-foreground/20 bg-secondary/70 py-4 backdrop-blur">
          <div className="flex w-max animate-marquee gap-12 text-secondary-foreground">
            {[...materials, ...materials].map((m, i) => <span key={i} className="font-display text-xl font-semibold">{m} <span className="text-primary">●</span></span>)}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary py-10">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-4 px-6">
          {values.map(({ icon: I, t }) => (
            <div key={t} className="flex items-center gap-3 rounded-full bg-secondary-foreground/10 px-5 py-3 text-secondary-foreground"><I className="h-5 w-5 text-primary" />{t}</div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-4xl font-extrabold md:text-5xl">Why build with us</h2>
        <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
          <img src={delivery} alt="Construction workers unloading cement and iron rods at a Ghanaian home building site" loading="lazy" width={1200} height={900} className="rounded-3xl object-cover" />
          <div className="grid gap-5">
            {benefits.map(({ icon: I, t, d }) => (
              <div key={t} className="flex gap-4 rounded-2xl bg-card p-5 shadow-sm">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary"><I className="h-6 w-6 text-primary-foreground" /></div>
                <div><h3 className="text-lg font-bold">{t}</h3><p className="text-muted-foreground">{d}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How */}
      <section id="how" className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">How it works</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-5">
            {steps.map(({ icon: I, t, d }, i) => (
              <div key={t} className="rounded-2xl bg-card p-6">
                <span className="font-display text-sm font-bold text-accent">Step {i + 1}</span>
                <I className="my-4 h-8 w-8 text-accent" />
                <h3 className="font-bold">{t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{d}</p>
              </div>
            ))}
          </div>
          <div id="get-the-app" className="mt-14 scroll-mt-6 rounded-3xl bg-card p-8 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">Coming soon</p>
            <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">Order it from your phone</h3>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">The CalixaHomes app is in development. Tap a store below to be told the day it launches — or contact us to start your build today.</p>
            <AppStoreBadges className="mt-6 justify-center" source="build_app_store" />
          </div>
        </div>
      </section>

      {/* Tracking */}
      <section id="track" className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-4xl font-extrabold md:text-5xl">Watch your house rise, from miles away.</h2>
          <p className="mt-4 text-lg text-muted-foreground">Every delivery and every milestone is logged with photos, so you always know what was delivered, what was used and what comes next.</p>
        </div>
        <div className="rounded-3xl bg-card p-6 shadow-glow">
          <img src={site} alt="CalixaHomes construction team building a reinforced house foundation" loading="lazy" width={1600} height={1008} className="h-48 w-full rounded-2xl object-cover" />
          <div className="mt-5 flex items-center justify-between"><h3 className="font-bold">East Legon Residence</h3><span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">54% complete</span></div>
          <ul className="mt-4 space-y-3">
            {stages.map((s) => (
              <li key={s.t}>
                <div className="flex justify-between text-sm"><span className="flex items-center gap-2">{s.p === 100 && <Check className="h-4 w-4 text-accent" />}{s.t}</span><span className="text-muted-foreground">{s.p}%</span></div>
                <div className="mt-1 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-primary" style={{ width: `${s.p}%` }} /></div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-secondary py-20 text-center text-secondary-foreground">
        <h2 className="mx-auto max-w-2xl px-6 text-4xl font-extrabold md:text-5xl">Send materials, not money worries.</h2>
        <AppComingSoonDialog source="build_start_your_build" description={appDescription}>
          <Button className="mt-8 h-auto rounded-full px-8 py-3 font-bold shadow-glow">Start Your Build</Button>
        </AppComingSoonDialog>
              </section>
      <SiteFooter />
    </main>
  );
}
