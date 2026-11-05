import { Link } from "@tanstack/react-router";
import { Instagram, Mail, Phone } from "lucide-react";
import logo from "@/assets/calixa-logo.jpg.asset.json";

export const SUPPORT_EMAIL = "help@calixahomes.com";
export const SUPPORT_PHONE = "+1 (925) 384-6734";
export const SOCIALS = {
  x: "https://x.com/calixahomes",
  instagram: "https://www.instagram.com/calixahomes/",
  whatsapp: "https://api.whatsapp.com/send/?phone=%2B19253846734&text&type=phone_number&app_absent=0",
};

const navLinks = [
  { to: "/care", label: "Calixa Care" },
  { to: "/about", label: "About Us" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Logo({ size = 44 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <img src={logo.url} alt="CalixaHomes logo" width={size} height={size} className="rounded-full bg-card object-contain" style={{ width: size, height: size }} />
      <span className="font-display text-xl font-extrabold">Calixa<span className="text-primary">Homes</span></span>
    </Link>
  );
}

export function SiteNav({ light = false }: { light?: boolean }) {
  return (
    <nav className={`flex flex-wrap items-center justify-between gap-4 py-6 ${light ? "text-secondary-foreground" : "text-foreground"}`}>
      <Logo />
      <div className="flex items-center gap-5 text-sm font-semibold">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className="hidden opacity-90 hover:text-primary sm:inline" activeProps={{ className: "text-primary" }}>{l.label}</Link>
        ))}
        <Link to="/contact" className="rounded-full bg-primary px-5 py-2 font-bold text-primary-foreground">Get Started</Link>
      </div>
    </nav>
  );
}

function XIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M18.9 2H22l-7.6 8.7L23 22h-6.8l-5.3-6.9L4.8 22H1.7l8.1-9.3L1 2h7l4.8 6.3L18.9 2Zm-1.2 18h1.9L7.4 3.9H5.4L17.7 20Z" /></svg>;
}
function WhatsAppIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.7-.4Z" /></svg>;
}

export function SiteFooter() {
  const social = "grid h-10 w-10 place-items-center rounded-full bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors";
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo size={56} />
          <p className="mt-4 font-display text-lg font-semibold text-primary">Build The Calixa Way</p>
          <p className="mt-2 max-w-sm text-sm opacity-75">Order building materials, get them delivered to your site and follow your construction from anywhere in the world.</p>
          <div className="mt-6 flex gap-3">
            <a href={SOCIALS.x} target="_blank" rel="noreferrer" aria-label="CalixaHomes on X" className={social}><XIcon className="h-4 w-4" /></a>
            <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" aria-label="CalixaHomes on Instagram" className={social}><Instagram className="h-5 w-5" /></a>
            <a href={SOCIALS.whatsapp} target="_blank" rel="noreferrer" aria-label="Chat with CalixaHomes on WhatsApp" className={social}><WhatsAppIcon className="h-5 w-5" /></a>
          </div>
        </div>
        <div>
          <h4 className="font-display font-bold">Company</h4>
          <ul className="mt-4 space-y-2 text-sm opacity-80">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            {navLinks.map((l) => <li key={l.to}><Link to={l.to} className="hover:text-primary">{l.label}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-display font-bold">Get in touch</h4>
          <ul className="mt-4 space-y-3 text-sm opacity-80">
            <li><a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-2 hover:text-primary"><Mail className="h-4 w-4" />{SUPPORT_EMAIL}</a></li>
            <li><a href="tel:+19253846734" className="flex items-center gap-2 hover:text-primary"><Phone className="h-4 w-4" />{SUPPORT_PHONE}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/15 py-6 text-center text-xs opacity-60">© 2026 CalixaHomes. Building homes across Africa.</div>
    </footer>
  );
}
