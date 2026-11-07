import { useEffect, useRef, useState } from "react";
import globePoster from "@/assets/globe-diaspora-approved.jpg.asset.json";

export default function DiasporaGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void import("./globe-scene").then(({ mountGlobe }) => {
      if (!disposed) cleanup = mountGlobe(element, () => { if (!disposed) setReady(true); });
    }).catch(() => { /* Keep the approved illustration if WebGL is unavailable. */ });
    return () => { disposed = true; cleanup?.(); };
  }, []);
  return (
    <div className="relative aspect-[3/2] max-h-[42rem] w-full overflow-hidden" role="img" aria-label="Cinematic journeys across a natural blue Earth, following one CalixaHomes user at a time from the USA, Canada, UK, France, Germany and Australia to a home construction site in Africa">
      <img
        src={globePoster.url}
        alt=""
        className={`absolute inset-0 h-full w-full object-contain transition-opacity ${ready ? "opacity-0" : "opacity-100"}`}
      />
      <div ref={host} className={`globe-canvas absolute inset-0 transition-opacity ${ready ? "opacity-100" : "opacity-0"}`} />
    </div>
  );
}
