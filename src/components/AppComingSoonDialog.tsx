import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { z } from "zod";
import { Smartphone, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailSchema = z.string().trim().email("Please enter a valid email").max(255);

export function AppComingSoonDialog({ children, source, description = "Booking pros and joining as a provider will happen in our mobile app, launching soon." }: { children: ReactNode; source: string; description?: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"info" | "form" | "done">("info");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return setError(parsed.error.issues[0]?.message ?? "Please enter a valid email");
    setBusy(true);
    setError("");
    const { error } = await supabase.from("app_waitlist").insert({ email: parsed.data, source });
    setBusy(false);
    if (error) return setError("Something went wrong. Please try again.");
    setStep("done");
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) { setStep("info"); setEmail(""); setError(""); } }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="mb-2 grid h-12 w-12 place-items-center rounded-xl bg-primary"><Smartphone className="h-6 w-6 text-primary-foreground" /></div>
          <DialogTitle className="font-display text-2xl">{step === "done" ? "You're on the list!" : "The Calixa app is coming soon"}</DialogTitle>
          <DialogDescription>
            {step === "done" ? "We'll email you as soon as the CalixaHomes app is ready." : description}
          </DialogDescription>
        </DialogHeader>
        {step === "info" && <Button onClick={() => setStep("form")} className="w-full font-bold">Notify me when it's ready</Button>}
        {step === "form" && (
          <form onSubmit={submit} className="space-y-3">
            <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Email address" autoFocus />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={busy} className="w-full font-bold">{busy ? "Submitting…" : "Notify me"}</Button>
          </form>
        )}
        {step === "done" && <CheckCircle2 className="mx-auto h-12 w-12 text-accent" />}
        <Button asChild variant="outline" className="w-full font-bold">
          <Link to="/contact" onClick={() => setOpen(false)}>Contact Us</Link>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
