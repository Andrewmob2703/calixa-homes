export const JOURNEY_SECONDS = 14;
export const globeUsers = [
  { country: "USA", lat: 40.7, lon: -74 },
  { country: "Canada", lat: 45.5, lon: -73.6 },
  { country: "UK", lat: 51.5, lon: -0.1 },
  { country: "France", lat: 48.9, lon: 2.4 },
  { country: "Germany", lat: 52.5, lon: 13.4 },
  { country: "Australia", lat: -33.9, lon: 151.2 },
  { country: "UAE", lat: 25.2, lon: 55.3 },
  { country: "China", lat: 31.2, lon: 121.5 },
];
export const globeHousePalettes = ["clay", "sage", "sand", "sky"] as const;
const houseDesign = (homes: 1 | 3, palette: typeof globeHousePalettes[number]) => ({ homes, palette });
export const globeSites = [
  { country: "Ghana", lat: 5.6, lon: -0.2, design: houseDesign(1, "clay") },
  { country: "Nigeria", lat: 6.5, lon: 3.4, design: houseDesign(3, "sand") },
  { country: "Kenya", lat: -1.3, lon: 36.8, design: houseDesign(1, "sage") },
  { country: "South Africa", lat: -26.2, lon: 28, design: houseDesign(3, "sky") },
];
export const CYCLE_SECONDS = JOURNEY_SECONDS * globeUsers.length;
function seededRandom(seed: number) {
  let value = (Math.max(0, Math.floor(seed)) + 1) | 0;
  return () => {
    value = (value + 0x6D2B79F5) | 0;
    let mixed = Math.imul(value ^ (value >>> 15), 1 | value);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffledIndices(length: number, random: () => number) {
  const indices = Array.from({ length }, (_, index) => index);
  for (let index = indices.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [indices[index], indices[swap]] = [indices[swap]!, indices[index]!];
  }
  return indices;
}
// A seeded shuffle keeps frozen-time checks reproducible while every cycle gets new pairings.
export function journeyOrder(cycle: number) {
  const random = seededRandom(cycle);
  const users = shuffledIndices(globeUsers.length, random);
  const sites = shuffledIndices(globeSites.length, random);
  return users.map((userIndex, position) => ({ userIndex, siteIndex: sites[position % sites.length] ?? 0 }));
}
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
  const time = Math.max(0, seconds);
  const cycle = reducedMotion ? 0 : Math.floor(time / CYCLE_SECONDS);
  const cycleTime = reducedMotion ? 10 : time % CYCLE_SECONDS;
  const position = Math.floor(cycleTime / JOURNEY_SECONDS);
  const local = cycleTime % JOURNEY_SECONDS;
  const order = journeyOrder(cycle);
  const journey = order[position] ?? order[0];
  const nextJourney = order[position + 1] ?? journeyOrder(cycle + 1)[0];
  const user = globeUsers[journey?.userIndex ?? 0] ?? globeUsers[0];
  const siteIndex = journey?.siteIndex ?? 0;
  const site = globeSites[siteIndex] ?? globeSites[0];
  const next = globeUsers[nextJourney?.userIndex ?? 0] ?? globeUsers[0];
  const index = journey?.userIndex ?? 0;
  // All arrays are nonempty; guards keep this module safe if the data is edited.
  if (!user || !site || !next) throw new Error("Globe journeys require origins and destinations");
  const from = geographicPoint(user.lat, user.lon), to = geographicPoint(site.lat, site.lon);
  const progress = ease((local - 2) / 7);
  const fade = 1 - ease(local - 11);
  const transfer = ease((local - 12) / 2);
  const focus = local < 12 ? arcDirection(from, to, progress) : arcDirection(to, geographicPoint(next.lat, next.lon), transfer);
  return {
    index, siteIndex, local, progress, focus,
    marker: reducedMotion ? 0 : ease(local / .9) * fade,
    line: local >= 2 && local < 12 ? fade : 0,
    lineStart: 0,
    house: ease((local - 9) / .7) * fade,
    construction: reducedMotion ? 1 : ease((local - 9) / 2),
    // Pull back between journeys, then push in and track the moving line head.
    distance: local < 2 ? 3.65 - 1.05 * ease(local / 2) : local < 12 ? 2.6 + .15 * Math.sin(progress * Math.PI) : 2.6 + 1.05 * ease((local - 12) / 1.2),
    lookRadius: local < 2 ? .25 + .3 * ease(local / 2) : local < 12 ? .55 : .55 - .3 * ease((local - 12) / 1.2),
  };
}
