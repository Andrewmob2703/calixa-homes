import { useEffect, useRef, useState } from "react";

export default function DiasporaGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("./globe-scene").then(({ mountGlobe }) => {
      if (disposed) return;
      cleanup = mountGlobe(element, () => { if (!disposed) setStatus("ready"); });
    }).catch(() => { if (!disposed) setStatus("unavailable"); });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return (
    <div className="relative aspect-[3/2] max-h-[42rem] w-full overflow-hidden" role="img" aria-label="Cinematic journeys across a natural blue Earth, following one CalixaHomes user at a time from the USA, Canada, UK, France, Germany, Australia, UAE and China to a home construction site in Africa">
      <div ref={host} className={`globe-canvas absolute inset-0 transition-opacity ${status === "ready" ? "opacity-100" : "opacity-0"}`} />
      {status === "loading" && (
        <div className="absolute inset-0 grid place-items-center" aria-hidden="true">
          <div className="flex flex-col items-center gap-4">
            <span className="h-12 w-12 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
            <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Loading the globe</p>
          </div>
        </div>
      )}
      {status === "unavailable" && (
        <div className="absolute inset-0 grid place-items-center px-8 text-center">
          <p className="max-w-sm text-muted-foreground">Your browser can't display the live globe. Enable hardware acceleration or try another browser to see the journeys.</p>
        </div>
      )}
    </div>
  );
}
