import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import { SiteNav, SiteFooter, SUPPORT_EMAIL, SUPPORT_PHONE } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — CalixaHomes" },
      { name: "description", content: "Read the CalixaHomes privacy notice for website enquiries, app launch notifications and your privacy choices." },
      { property: "og:title", content: "Privacy Policy — CalixaHomes" },
      { property: "og:description", content: "A clear guide to information you share with CalixaHomes and how to contact us about privacy." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "https://calixa-homes.lovable.app/privacy-policy" },
    ],
    links: [{ rel: "canonical", href: "https://calixa-homes.lovable.app/privacy-policy" }],
  }),
  component: PrivacyPolicy,
});

const sections = [
  { id: "scope", title: "Who this notice is for", paragraphs: [
    "CalixaHomes helps people abroad connect with building services through Calixa Build and house-maintenance professionals through Calixa Care. This notice covers our current website, enquiries and mobile-app launch notification list.",
    "Our mobile app is in development. This notice does not describe an active in-app checkout, account system or project-tracking service. Information about those features will need to be provided before they launch.",
  ] },
  { id: "information", title: "Information you share", paragraphs: [
    "When you join the app notification list, you submit your email address. The website also records which notification button you used, such as a Calixa Build or Calixa Care button.",
    "If you contact us, you may share your name, email address, phone number, message and details about your property or enquiry. Please share only what is relevant, and avoid sending passwords, card details, identity documents or sensitive information in an initial message.",
    "The contact form prepares a message in your own email application. Completing the form alone does not send it; you choose whether to send the prepared email.",
  ] },
  { id: "purposes", title: "Why you share information", paragraphs: [
    "The app notification form is intended for requests to hear when the CalixaHomes app is ready. Enquiries are intended to help our team understand your request and discuss getting started with building or house maintenance directly.",
    "Submitting an enquiry or asking for an app notification is not a request to make a payment, create an app account or book a service through this website.",
  ] },
  { id: "other-services", title: "Email, WhatsApp and other services", paragraphs: [
    "The website includes links to email, phone, WhatsApp, Instagram and X. When you use those services, their own privacy policies and settings apply as well. Review them before sharing information there.",
    "If you discuss a construction or maintenance arrangement with us, ask our team which project information would be needed and who would receive it before sharing site access instructions, another person's contact details or property documents.",
  ] },
  { id: "cookies", title: "Cookies and browser settings", paragraphs: [
    "You can review, block or clear cookies and site storage through your browser settings. Blocking some browser features may affect how a website works.",
    "This notice does not claim that optional advertising or analytics tools are enabled. Details of any such tools and relevant choices should be provided if they are introduced.",
  ] },
  { id: "choices", title: "Your privacy questions and choices", paragraphs: [
    "Contact us if you want to ask about information you have shared, correct an enquiry, withdraw an app notification request or request removal from the notification list. Include the email address you used so the team can identify your request; do not send a password.",
    "Depending on the laws that apply to you, you may have rights relating to access, correction, deletion, restrictions on use or a copy of your information. Contact us to discuss a request. This notice does not promise a specific outcome or response deadline.",
  ] },
  { id: "future", title: "As CalixaHomes grows", paragraphs: [
    "Before new app features become available, this notice will need to explain any additional information they require. Details such as the responsible legal entity, service providers, processing locations, retention periods and applicable legal grounds also need confirmation before this draft is adopted as a final policy.",
    "Use the review date at the top of this page to identify this version. If you have a question about whether it covers a service you are considering, ask our team before proceeding.",
  ] },
];

function PrivacyPolicy() {
  return (
    <main className="bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-6"><SiteNav /></div>
      <header className="border-y border-border bg-muted">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-accent"><FileText className="h-5 w-5" /> CalixaHomes</div>
          <h1 className="text-5xl font-extrabold md:text-6xl">Privacy Policy</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Your home is personal. So is the information you share with us.</p>
          <p className="mt-6 text-sm text-muted-foreground">Draft for review · Last updated November 8, 2026</p>
        </div>
      </header>
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 lg:grid-cols-[240px_1fr] lg:gap-20">
        <aside>
          <nav aria-label="Privacy policy sections" className="lg:sticky lg:top-8">
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-accent">In this policy</p>
            <ol className="space-y-3 border-l border-border pl-4">
              {sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">{String(index + 1).padStart(2, "0")} — {section.title}</a></li>)}
              <li><a href="#privacy-contact" className="text-sm text-muted-foreground hover:text-foreground">08 — Contact us</a></li>
            </ol>
          </nav>
        </aside>
        <article className="min-w-0">
          <p className="mb-10 border-l-2 border-primary pl-5 text-muted-foreground">This draft reflects the current website experience. It is not a final legal policy and needs CalixaHomes' review before adoption.</p>
          {sections.map((section, index) => (
            <section id={section.id} key={section.id} className="scroll-mt-8 border-b border-border pb-9 pt-9 first:pt-0">
              <p className="mb-2 text-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="text-2xl font-bold">{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 leading-7 text-muted-foreground">{paragraph}</p>)}
            </section>
          ))}
          <section id="privacy-contact" className="scroll-mt-8 pt-9">
            <p className="mb-2 text-sm font-semibold text-accent">08</p>
            <h2 className="text-2xl font-bold">Let's talk about privacy</h2>
            <p className="mt-4 leading-7 text-muted-foreground">For privacy questions or a request about information you have shared, contact CalixaHomes at:</p>
            <Button asChild className="mt-5"><a href={`mailto:${SUPPORT_EMAIL}?subject=CalixaHomes%20privacy%20enquiry`}>{SUPPORT_EMAIL}<ArrowUpRight className="h-4 w-4" /></a></Button>
            <p className="mt-4 text-sm text-muted-foreground">Phone: <a href="tel:+19253846734" className="underline underline-offset-4">{SUPPORT_PHONE}</a></p>
          </section>
        </article>
      </div>
      <SiteFooter />
    </main>
  );
}