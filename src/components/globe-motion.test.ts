import { describe, expect, it } from "vitest";
import { arcDirection, CYCLE_SECONDS, geographicPoint, globeSites, globeUsers, journeyFrame, JOURNEY_SECONDS } from "./globe-motion";

describe("Cinematic About globe journeys", () => {
  it("visits USA, Canada, Europe and Australia in order", () => {
    expect(globeUsers.map(user => user.country)).toEqual(["USA", "Canada", "UK", "France", "Germany", "Australia"]);
    globeUsers.forEach((_, index) => expect(journeyFrame(index * JOURNEY_SECONDS + 1).index).toBe(index));
  });
  it("never accumulates connections and clears each before the next origin", () => {
    for (let seconds = 0; seconds < CYCLE_SECONDS * 3; seconds += .1) {
      const frame = journeyFrame(seconds);
      const active = globeUsers.map((_, index) => index === frame.index && frame.line > 0);
      expect(active.filter(Boolean).length).toBeLessThanOrEqual(1);
      if (frame.local >= 12) {
        expect(frame.marker).toBe(0);
        expect(frame.line).toBe(0);
        expect(frame.house).toBe(0);
      }
    }
  });
  it("shows a face before departure and the house only after arrival, then removes both", () => {
    expect(journeyFrame(1).marker).toBe(1);
    expect(journeyFrame(1).line).toBe(0);
    expect(journeyFrame(5).marker).toBeLessThan(1);
    expect(journeyFrame(8.9).house).toBe(0);
    expect(journeyFrame(9).progress).toBe(1);
    expect(journeyFrame(10).house).toBe(1);
    expect(journeyFrame(12).house).toBe(0);
  });
  it("follows a moving head with only a short trailing segment", () => {
    const frame = journeyFrame(7);
    expect(frame.progress).toBeGreaterThan(.5);
    expect(frame.progress - frame.lineStart).toBeCloseTo(.32);
  });
  it("zooms to the origin, tracks to Africa and pulls out for the next journey", () => {
    const first = globeUsers[0], site = globeSites[0];
    if (!first || !site) throw new Error("Missing globe geography");
    expect(journeyFrame(0).focus).toEqual(geographicPoint(first.lat, first.lon));
    expect(journeyFrame(2).distance).toBeLessThan(journeyFrame(0).distance);
    const arrival = journeyFrame(9).focus, destination = geographicPoint(site.lat, site.lon);
    expect(arrival.x).toBeCloseTo(destination.x);
    expect(arrival.y).toBeCloseTo(destination.y);
    expect(arrival.z).toBeCloseTo(destination.z);
    expect(journeyFrame(13.8).distance).toBeGreaterThan(journeyFrame(10).distance);
  });
  it("restarts the entire sequence cleanly after every country", () => {
    expect(CYCLE_SECONDS).toBe(84);
    expect(journeyFrame(CYCLE_SECONDS)).toEqual(journeyFrame(0));
    expect(journeyFrame(CYCLE_SECONDS + 5)).toEqual(journeyFrame(5));
  });
  it("keeps camera focus continuous between journeys and across reset", () => {
    for (let seconds = JOURNEY_SECONDS; seconds <= CYCLE_SECONDS; seconds += JOURNEY_SECONDS) {
      const before = journeyFrame(seconds - .001), after = journeyFrame(seconds);
      expect(Math.hypot(before.focus.x - after.focus.x, before.focus.y - after.focus.y, before.focus.z - after.focus.z)).toBeLessThan(.001);
      expect(Math.abs(before.distance - after.distance)).toBeLessThan(.001);
    }
  });
  it("holds one quiet African destination for reduced motion", () => {
    expect(journeyFrame(0, true)).toEqual(journeyFrame(1000, true));
    expect(journeyFrame(0, true).marker).toBe(0);
    expect(journeyFrame(0, true).house).toBe(1);
  });
  it("interpolates on the sphere without dipping inside it", () => {
    const from = geographicPoint(-33.9, 151.2), to = geographicPoint(6.5, 3.4);
    for (let t = 0; t <= 1; t += .05) {
      const point = arcDirection(from, to, t);
      expect(Math.hypot(point.x, point.y, point.z)).toBeCloseTo(1);
    }
  });
});