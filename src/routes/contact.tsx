import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, MessageCircle } from "lucide-react";
import { SiteNav, SiteFooter, SUPPORT_EMAIL, SUPPORT_PHONE, SOCIALS } from "@/components/SiteChrome";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — CalixaHomes" },
      { name: "description", content: "Get in touch with CalixaHomes by email, phone or WhatsApp to start building your home in Africa." },
      { property: "og:title", content: "Contact Us — CalixaHomes" },
      { property: "og:description", content: "Questions about your build? Our team is here to help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const field = "w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring";
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Enquiry from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
  };
  const cards = [
    { icon: Mail, t: "Email us", v: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
    { icon: Phone, t: "Call us", v: SUPPORT_PHONE, href: "tel:+19253846734" },
    { icon: MessageCircle, t: "WhatsApp", v: "Chat with our team", href: SOCIALS.whatsapp },
  ];
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6"><SiteNav /></div>
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-extrabold">Let's talk about your build.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Have a question about materials, delivery or tracking? Reach out and our team will get back to you.</p>
          <div className="mt-8 space-y-4">
            {cards.map(({ icon: I, t, v, href }) => (
              <a key={t} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-card p-5 shadow-sm hover:shadow-glow">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary"><I className="h-6 w-6 text-primary-foreground" /></div>
                <div><p className="font-bold">{t}</p><p className="text-muted-foreground">{v}</p></div>
              </a>
            ))}
          </div>
        </div>
        <form onSubmit={submit} className="space-y-4 rounded-3xl bg-card p-8 shadow-sm">
          <h2 className="text-2xl font-bold">Send a message</h2>
          <input required placeholder="Your name" className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input required type="email" placeholder="Your email" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <textarea required rows={5} placeholder="Tell us about your project" className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          <button type="submit" className="w-full rounded-full bg-primary px-6 py-3 font-bold text-primary-foreground shadow-glow">Send message</button>
        </form>
      </section>
      <SiteFooter />
    </main>
  );
}
