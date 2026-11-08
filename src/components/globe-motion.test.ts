import { describe, expect, it } from "vitest";
import { arcDirection, CYCLE_SECONDS, geographicPoint, globeSites, globeUsers, journeyFrame, journeyOrder, JOURNEY_SECONDS } from "./globe-motion";

describe("Cinematic About globe journeys", () => {
  it("includes USA, Canada, Europe, Australia, UAE and China", () => {
    expect(globeUsers.map(user => user.country)).toEqual(["USA", "Canada", "UK", "France", "Germany", "Australia", "UAE", "China"]);
  });
  it("mixes single homes with three-house estates at the African destinations", () => {
    expect(globeSites.map(site => site.design.homes)).toEqual([1, 3, 1, 3]);
  });
  it("gives the single homes different color palettes", () => {
    const singleHomePalettes = globeSites.filter(site => site.design.homes === 1).map(site => site.design.palette);
    expect(singleHomePalettes).toEqual(["clay", "sage"]);
    expect(new Set(singleHomePalettes).size).toBe(2);
  });
  it("shuffles every origin and African destination pairing on each cycle", () => {
    const orders = Array.from({ length: 12 }, (_, cycle) => journeyOrder(cycle));
    orders.forEach(order => {
      expect(order.map(journey => journey.userIndex).sort((a, b) => a - b)).toEqual(globeUsers.map((_, index) => index));
      order.forEach(journey => expect(globeSites[journey.siteIndex]).toBeDefined());
    });
    expect(new Set(orders.map(order => order.map(journey => journey.userIndex).join(","))).size).toBeGreaterThan(1);
    expect(new Set(orders.map(order => order.map(journey => journey.siteIndex).join(","))).size).toBeGreaterThan(1);
    expect(journeyOrder(3)).toEqual(journeyOrder(3));
    journeyOrder(0).forEach((journey, position) => expect(journeyFrame(position * JOURNEY_SECONDS + 1).index).toBe(journey.userIndex));
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
  it("keeps the face until after arrival and shows the house only after arrival, then removes both", () => {
    expect(journeyFrame(1).marker).toBe(1);
    expect(journeyFrame(1).line).toBe(0);
    expect(journeyFrame(5).marker).toBe(1);
    expect(journeyFrame(8.9).house).toBe(0);
    expect(journeyFrame(9).progress).toBe(1);
    expect(journeyFrame(10).marker).toBe(1);
    expect(journeyFrame(10).house).toBe(1);
    expect(journeyFrame(12).house).toBe(0);
  });
  it("builds each house from foundation to a full roof after arrival", () => {
    expect(journeyFrame(8.9).construction).toBe(0);
    expect(journeyFrame(9).construction).toBe(0);
    expect(journeyFrame(10).construction).toBeGreaterThan(0);
    expect(journeyFrame(10).construction).toBeLessThan(1);
    expect(journeyFrame(11).construction).toBe(1);
    expect(journeyFrame(0, true).construction).toBe(1);
  });
  it("grows one unbroken line from the origin to Africa", () => {
    const frame = journeyFrame(7);
    expect(frame.progress).toBeGreaterThan(.5);
    expect(frame.lineStart).toBe(0);
    expect(journeyFrame(10).lineStart).toBe(0);
  });
  it("zooms to the origin, tracks to Africa and pulls out for the next journey", () => {
    const firstJourney = journeyOrder(0)[0];
    const first = globeUsers[firstJourney?.userIndex ?? 0], site = globeSites[firstJourney?.siteIndex ?? 0];
    if (!first || !site) throw new Error("Missing globe geography");
    expect(journeyFrame(0).focus).toEqual(geographicPoint(first.lat, first.lon));
    expect(journeyFrame(2).distance).toBeLessThan(journeyFrame(0).distance);
    const arrival = journeyFrame(9).focus, destination = geographicPoint(site.lat, site.lon);
    expect(arrival.x).toBeCloseTo(destination.x);
    expect(arrival.y).toBeCloseTo(destination.y);
    expect(arrival.z).toBeCloseTo(destination.z);
    expect(journeyFrame(13.8).distance).toBeGreaterThan(journeyFrame(10).distance);
  });
  it("restarts cleanly with a newly shuffled cycle", () => {
    expect(CYCLE_SECONDS).toBe(112);
    const restarted = journeyFrame(CYCLE_SECONDS);
    expect(restarted.local).toBe(0);
    expect(restarted.marker).toBe(0);
    expect(restarted.line).toBe(0);
    expect(restarted.house).toBe(0);
    expect(restarted.index).toBe(journeyOrder(1)[0]?.userIndex);
    expect(journeyFrame(CYCLE_SECONDS + 5).local).toBe(5);
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