import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServiceSlideshow({ images, label, controlsClassName = "bottom-6" }: {
  images: readonly { src: string; alt: string }[];
  label: string;
  controlsClassName?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || focused || images.length < 2) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive((current) => (current + 1) % images.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, reducedMotion, focused, images.length, active]);

  if (!images.length) return null;
  const move = (direction: number) => setActive((current) => (current + direction + images.length) % images.length);
  const stopped = paused || reducedMotion;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} data-active-slide={active} className="absolute inset-0">
      {images.map((image, index) => (
        <img key={image.src} src={image.src} alt={image.alt} width={1600} height={1008}
          loading={index === 0 ? "eager" : "lazy"} aria-hidden={index !== active}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 motion-reduce:transition-none ${index === active ? "opacity-100" : "opacity-0"}`} />
      ))}
      <div className={`absolute right-6 z-20 flex items-center gap-1 rounded-full border border-secondary-foreground/30 bg-secondary/80 p-1 text-secondary-foreground backdrop-blur ${controlsClassName}`}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Previous photo" title="Previous photo" onClick={() => move(-1)}><ChevronLeft className="h-4 w-4" /></Button>
        <span className="min-w-12 text-center text-xs font-semibold" aria-live="off">{active + 1} / {images.length}</span>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Next photo" title="Next photo" onClick={() => move(1)}><ChevronRight className="h-4 w-4" /></Button>
        <Button type="button" variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label={stopped ? "Play slideshow" : "Pause slideshow"} title={stopped ? "Play slideshow" : "Pause slideshow"} onClick={() => { setReducedMotion(false); setPaused(!stopped); }}>{stopped ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}</Button>
      </div>
    </div>
  );
}