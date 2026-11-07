export const TURN_SECONDS = 80;
export const CONNECTION_SECONDS = 4;
const ROTATION_START = 1.35;

export function globeRotation(seconds: number, reducedMotion = false) {
  if (reducedMotion) return -0.28;
  return ROTATION_START - Math.PI * (1 - Math.cos(Math.max(0, seconds) * Math.PI * 2 / TURN_SECONDS)) / 2;
}

export function connectionReveal(seconds: number, index: number, reducedMotion = false) {
  if (reducedMotion) return { marker: 1, line: 1, house: 1 };
  const elapsed = Math.max(0, seconds) - index * CONNECTION_SECONDS;
  const clamp = (value: number) => Math.min(1, Math.max(0, value));
  return {
    marker: clamp(elapsed / 0.6),
    line: clamp((elapsed - 0.6) / 2.4),
    house: clamp((elapsed - 3) / 0.6),
  };
}

export const globeUsers = [
  { country: "USA", lat: 40.7, lon: -74, markerLat: 35, markerLon: -91 },
  { country: "Canada", lat: 45.5, lon: -73.6, markerLat: 60, markerLon: -63 },
  { country: "UK", lat: 51.5, lon: -0.1, markerLat: 63, markerLon: -18 },
  { country: "France", lat: 48.9, lon: 2.4, markerLat: 36, markerLon: -12 },
  { country: "Germany", lat: 52.5, lon: 13.4, markerLat: 57, markerLon: 32 },
  { country: "Australia", lat: -33.9, lon: 151.2, markerLat: -30, markerLon: 140 },
];

export const globeSites = [
  { country: "Ghana", lat: 5.6, lon: -0.2 },
  { country: "Nigeria", lat: 6.5, lon: 3.4 },
  { country: "Kenya", lat: -1.3, lon: 36.8 },
  { country: "South Africa", lat: -26.2, lon: 28 },
];