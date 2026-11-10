import { AppComingSoonDialog } from "@/components/AppComingSoonDialog";

function AppleIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.6 4.6 0 0 0-3.6-2c-1.5-.2-3 .9-3.7.9-.8 0-2-.9-3.2-.8A4.8 4.8 0 0 0 4 9.4c-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.1-1.2 2.9-2.4a10 10 0 0 0 1.3-2.7 4.2 4.2 0 0 1-2.3-3.9ZM14 5.4A4.3 4.3 0 0 0 15 2a4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3.2A3.6 3.6 0 0 0 14 5.4Z" /></svg>;
}
function PlayIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="M3.6 2.2 13.4 12l-9.8 9.8a1.5 1.5 0 0 1-.6-1.2V3.4c0-.5.2-.9.6-1.2Zm11 8.6 2.6-2.6L5.3 1.5l9.3 9.3Zm0 2.4-9.3 9.3 11.9-6.7-2.6-2.6Zm3.9-4.3-2.9 3.1 2.9 3.1 2.9-1.6c.8-.5.8-1.6 0-2.1l-2.9-1.5Z" /></svg>;
}

const stores = [
  { label: "App Store", top: "Download on the", Icon: AppleIcon, iconClass: "h-8 w-8" },
  { label: "Google Play", top: "Get it on", Icon: PlayIcon, iconClass: "h-7 w-7" },
];

export function AppStoreBadges({
  source,
  description = "The CalixaHomes mobile app is in development and will be on the App Store and Google Play soon.",
  tone = "light",
  className = "",
}: {
  source: string;
  description?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const toneClass = tone === "dark"
    ? "border-secondary-foreground/25 bg-secondary-foreground/5 text-secondary-foreground hover:border-primary hover:text-primary"
    : "border-border bg-card text-foreground hover:border-primary hover:text-primary";

  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {stores.map(({ label, top, Icon, iconClass }) => (
        <AppComingSoonDialog key={label} source={source} description={description}>
          <button type="button" aria-label={`CalixaHomes on ${label} (coming soon)`} className={`flex items-center gap-3 rounded-2xl border px-14 py-3.5 text-left transition-colors ${toneClass}`}>
            <Icon className={iconClass} />
            <span className="leading-tight"><span className="block text-sm opacity-75">{top}</span><span className="block text-xl font-bold">{label}</span></span>
          </button>
        </AppComingSoonDialog>
      ))}
    </div>
  );
}
