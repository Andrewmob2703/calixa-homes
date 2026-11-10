import { useEffect, useRef, useState } from "react";
import globeLoading from "@/assets/globe-loading.webp";

// Deterministic starfield so SSR and client render identical stars.
const stars = Array.from({ length: 150 }, (_, i) => ({
  x: (i * 73.7) % 100,
  y: (i * 41.3) % 100,
  size: 1 + ((i * 7) % 3) * 0.6,
  opacity: 0.3 + ((i * 13) % 10) / 14,
}));

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
    <div className="relative aspect-[3/2] max-h-[42rem] w-full overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_center,#0b1e3a_0%,#050d1d_70%,#02060f_100%)]" role="img" aria-label="Cinematic journeys across a natural blue Earth, following one CalixaHomes user at a time from the USA, Canada, UK, France, Germany, Australia, UAE and China to a home construction site in Africa">
      <div aria-hidden="true" className="absolute inset-0">
        {stars.map((star, i) => (
          <span key={i} className="absolute rounded-full bg-white" style={{ left: `${star.x}%`, top: `${star.y}%`, width: star.size, height: star.size, opacity: star.opacity }} />
        ))}
      </div>
      <div ref={host} className={`globe-canvas absolute inset-0 transition-opacity ${status === "ready" ? "opacity-100" : "opacity-0"}`} />
      {status !== "unavailable" && (
        <img src={globeLoading} alt="" aria-hidden="true" className={`absolute inset-0 h-full w-full object-contain transition-opacity ${status === "ready" ? "opacity-0" : "opacity-100"}`} />
      )}
      {status === "unavailable" && (
        <div className="absolute inset-0 grid place-items-center px-8 text-center">
          <p className="max-w-sm text-muted-foreground">Your browser can't display the live globe. Enable hardware acceleration or try another browser to see the journeys.</p>
        </div>
      )}
    </div>
  );
}
