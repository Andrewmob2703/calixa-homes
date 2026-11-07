export const JOURNEY_SECONDS = 14;
export const globeUsers = [
  { country: "USA", lat: 40.7, lon: -74 },
  { country: "Canada", lat: 45.5, lon: -73.6 },
  { country: "UK", lat: 51.5, lon: -0.1 },
  { country: "France", lat: 48.9, lon: 2.4 },
  { country: "Germany", lat: 52.5, lon: 13.4 },
  { country: "Australia", lat: -33.9, lon: 151.2 },
];
export const globeSites = [
  { country: "Ghana", lat: 5.6, lon: -0.2 },
  { country: "Nigeria", lat: 6.5, lon: 3.4 },
  { country: "Kenya", lat: -1.3, lon: 36.8 },
  { country: "South Africa", lat: -26.2, lon: 28 },
];
export const CYCLE_SECONDS = JOURNEY_SECONDS * globeUsers.length;
const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t); };
export function geographicPoint(lat: number, lon: number) {
  const phi = lat * Math.PI / 180, theta = lon * Math.PI / 180;
  return { x: Math.cos(phi) * Math.sin(theta), y: Math.sin(phi), z: Math.cos(phi) * Math.cos(theta) };
}
export function arcDirection(from: ReturnType<typeof geographicPoint>, to: ReturnType<typeof geographicPoint>, progress: number) {
  const dot = clamp((from.x * to.x + from.y * to.y + from.z * to.z + 1) / 2) * 2 - 1;
  const angle = Math.acos(dot), t = clamp(progress);
  if (angle < .001) return { ...from };
  const a = Math.sin((1 - t) * angle) / Math.sin(angle), b = Math.sin(t * angle) / Math.sin(angle);
  return { x: from.x * a + to.x * b, y: from.y * a + to.y * b, z: from.z * a + to.z * b };
}
export function journeyFrame(seconds: number, reducedMotion = false) {
  const cycleTime = reducedMotion ? 10 : Math.max(0, seconds) % CYCLE_SECONDS;
  const index = Math.floor(cycleTime / JOURNEY_SECONDS);
  const local = cycleTime % JOURNEY_SECONDS;
  const user = globeUsers[index] ?? globeUsers[0];
  const siteIndex = index % globeSites.length;
  const site = globeSites[siteIndex] ?? globeSites[0];
  const next = globeUsers[(index + 1) % globeUsers.length] ?? globeUsers[0];
  // All arrays are nonempty; guards keep this module safe if the data is edited.
  if (!user || !site || !next) throw new Error("Globe journeys require origins and destinations");
  const from = geographicPoint(user.lat, user.lon), to = geographicPoint(site.lat, site.lon);
  const progress = ease((local - 2) / 7);
  const fade = 1 - ease(local - 11);
  const transfer = ease((local - 12) / 2);
  const focus = local < 12 ? arcDirection(from, to, progress) : arcDirection(to, geographicPoint(next.lat, next.lon), transfer);
  return {
    index, siteIndex, local, progress, focus,
    marker: reducedMotion ? 0 : ease(local / .9) * (1 - ease((local - 3.5) / 2)),
    line: local >= 2 && local < 12 ? fade : 0,
    lineStart: Math.max(0, progress - .32),
    house: ease((local - 9) / .7) * fade,
    // Pull back between journeys, then push in and track the moving line head.
    distance: local < 2 ? 3.65 - 1.05 * ease(local / 2) : local < 12 ? 2.6 + .15 * Math.sin(progress * Math.PI) : 2.6 + 1.05 * ease((local - 12) / 1.2),
    lookRadius: local < 2 ? .25 + .3 * ease(local / 2) : local < 12 ? .55 : .55 - .3 * ease((local - 12) / 1.2),
  };
}
