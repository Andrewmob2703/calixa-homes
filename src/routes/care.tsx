import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav, SiteFooter } from "@/components/SiteChrome";
import { ShieldCheck, Clock, Globe, Wallet, MessageCircle, UserCheck, Star } from "lucide-react";
import { careServices as services } from "@/components/care-services";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AppStoreBadges } from "@/components/AppStoreBadges";
import { ServiceSlideshow } from "@/components/ServiceSlideshow";
import { careImages } from "@/components/service-images";

export const Route = createFileRoute("/care")({
  head: () => ({
    meta: [
      { title: "Calixa Care — Trusted house maintenance professionals" },
      { name: "description", content: "Book verified plumbers, electricians, gardeners, cleaners, painters and repair professionals for your home in Africa — from anywhere in the world." },
      { property: "og:title", content: "Calixa Care — Trusted hands for your home back home" },
      { property: "og:description", content: "Trusted house maintenance, repairs, cleaning and gardening for your home back home, booked from abroad." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CarePage,
});

const why = [
  { icon: Clock, t: "Swift matching", d: "Get paired with a nearby pro, often the same day." },
  { icon: ShieldCheck, t: "Vetted & insured", d: "ID, background and skills checks on every provider." },
  { icon: Wallet, t: "Upfront pricing", d: "See the quote before you book. No surprises." },
  { icon: Globe, t: "Built for the diaspora", d: "Maintain your home from London, Houston or Toronto." },
];
const steps = [
  { icon: MessageCircle, t: "Tell us what's needed", d: "Pick a service, the home address and a time that suits you." },
  { icon: UserCheck, t: "Meet your pro", d: "We match a verified, highly-rated professional and share their profile." },
  { icon: Star, t: "Relax & review", d: "Get photo updates when the job is done, pay securely and rate the visit." },
];
const areas = ["Accra", "Kumasi", "Tema", "Takoradi", "Lagos", "Abuja", "Nairobi"];
const plans = [
  { n: "One-off", p: "Pay per job", f: ["Any single service", "Photo proof on completion", "Satisfaction guarantee"] },
  { n: "Home Watch", p: "Monthly", f: ["Monthly property inspection", "Gardening & cleaning visits", "Priority repairs", "Monthly report with photos"], hot: true },
];

function CarePage() {
  const [svc, setSvc] = useState("Plumbing");
  const [area, setArea] = useState("Accra");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("09:00");
  return (
    <main className="bg-background text-foreground">
      <section className="relative overflow-hidden">
        <ServiceSlideshow images={careImages} label="Calixa Care photos" />
        <div className="pointer-events-none absolute inset-0 bg-hero-overlay" />
        <div className="pointer-events-none relative mx-auto max-w-6xl px-6 pb-24 [&_nav]:pointer-events-auto [&_form]:pointer-events-auto">
          <SiteNav light getStartedHash="get-the-app" />
          <div className="pt-16 text-secondary-foreground">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">Calixa Care</p>
            <p className="mb-3 font-display text-2xl font-bold">Your Home. Our Care.</p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] md:text-7xl">Trusted hands for your home back home.</h1>
            <p className="mt-6 max-w-xl text-lg opacity-90">From fixing a leaking tap to keeping your garden tidy, book verified house-maintenance professionals to look after your property — wherever you are.</p>
          </div>
          <form onSubmit={(e) => e.preventDefault()} className="mt-10 grid gap-3 rounded-3xl bg-card p-4 text-card-foreground shadow-glow md:grid-cols-4">
            <label className="text-xs font-bold uppercase text-muted-foreground">What do you need?
              <select value={svc} onChange={(e) => setSvc(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-sm font-semibold normal-case text-foreground">
                {services.map((s) => <option key={s.t}>{s.t}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold uppercase text-muted-foreground">Where?
              <select value={area} onChange={(e) => setArea(e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background p-3 text-sm font-semibold normal-case text-foreground">
                {areas.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <div className="text-xs font-bold uppercase text-muted-foreground">When?
              <div className="mt-1 flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="flex flex-1 items-center gap-2 rounded-xl border border-input bg-background p-3 text-left text-sm font-semibold normal-case text-foreground">
                      <CalendarIcon className="h-4 w-4 text-accent" />{date ? format(date, "d MMM yyyy") : <span className="text-muted-foreground">Pick a date</span>}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="p-3 pointer-events-auto" />
                  </PopoverContent>
                </Popover>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} aria-label="Time" className="w-28 rounded-xl border border-input bg-background p-3 text-sm font-semibold text-foreground" />
              </div>
            </div>
            <button type="button" onClick={() => document.getElementById("get-the-app")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="grid place-items-center self-end rounded-xl bg-primary p-3 font-bold text-primary-foreground">Find a pro</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid gap-8 md:grid-cols-2 md:items-end">
          <h2 className="text-4xl font-extrabold md:text-5xl">House maintenance shouldn't be stressful — especially from abroad.</h2>
          <p className="text-lg text-muted-foreground">Your house is built. Now keep it clean, well maintained and in great condition. Every Calixa Care provider is screened, trained and accountable to us.</p>
        </div>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: I, t, d }) => (
            <div key={t} className="group rounded-2xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:shadow-glow">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-muted group-hover:bg-primary"><I className="h-6 w-6 text-accent group-hover:text-primary-foreground" /></div>
              <h3 className="mt-4 text-lg font-bold">{t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-secondary py-24 text-secondary-foreground">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">Why Calixa Care?</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-4">
            {why.map(({ icon: I, t, d }) => (
              <div key={t} className="rounded-2xl bg-secondary-foreground/10 p-6">
                <I className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-bold">{t}</h3>
                <p className="mt-2 text-sm opacity-80">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-4xl font-extrabold md:text-5xl">Booking is as easy as a chat</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {steps.map(({ icon: I, t, d }, i) => (
            <div key={t} className="relative rounded-3xl bg-muted p-8">
              <span className="font-display text-6xl font-extrabold text-primary/40">0{i + 1}</span>
              <I className="mt-2 h-8 w-8 text-accent" />
              <h3 className="mt-4 text-xl font-bold">{t}</h3>
              <p className="mt-2 text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
        <div id="get-the-app" className="mt-14 scroll-mt-6 rounded-3xl bg-card p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-widest text-primary">Coming soon</p>
          <h3 className="mt-3 text-2xl font-extrabold md:text-3xl">Book a pro from your phone</h3>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">The CalixaHomes app is in development. Tap a store below to be told the day it launches — or contact us to book a service today.</p>
          <AppStoreBadges className="mt-6 justify-center" source="care_app_store" />
        </div>
      </section>

      <section className="bg-muted py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-4xl font-extrabold md:text-5xl">Care plans for peace of mind</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {plans.map((p) => (
              <div key={p.n} className={`rounded-3xl p-8 ${p.hot ? "bg-secondary text-secondary-foreground shadow-glow" : "bg-card"}`}>
                {p.hot && <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">Most popular</span>}
                <h3 className="mt-4 text-2xl font-extrabold">{p.n}</h3>
                <p className="text-sm opacity-70">{p.p}</p>
                <ul className="mt-6 space-y-2 text-sm">{p.f.map((f) => <li key={f} className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-primary" />{f}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">Now serving</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">{areas.map((a) => <span key={a} className="rounded-full border border-border px-5 py-2 font-semibold">{a}</span>)}</div>
        <h2 className="mx-auto mt-14 max-w-2xl text-4xl font-extrabold md:text-5xl">Are you a skilled pro? Join Calixa Care.</h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Get steady house-maintenance jobs from diaspora homeowners and get paid on time.</p>
        <button type="button" onClick={() => document.getElementById("get-the-app")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="mt-8 inline-block rounded-full bg-primary px-8 py-3 font-bold text-primary-foreground shadow-glow">Apply as a provider</button>
      </section>
      <SiteFooter />
    </main>
  );
}
