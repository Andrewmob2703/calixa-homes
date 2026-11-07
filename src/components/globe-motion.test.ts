import { describe, expect, it } from "vitest";
import { connectionReveal, CONNECTION_SECONDS, globeRotation, globeUsers, TURN_SECONDS } from "./globe-motion";

describe("About globe motion", () => {
  it("turns exactly 180 degrees and returns rather than completing a revolution", () => {
    expect(globeRotation(0) - globeRotation(TURN_SECONDS / 2)).toBeCloseTo(Math.PI);
    expect(globeRotation(TURN_SECONDS)).toBeCloseTo(globeRotation(0));
    expect(globeRotation(TURN_SECONDS / 2 - 1)).toBeGreaterThan(globeRotation(TURN_SECONDS / 2));
    expect(globeRotation(TURN_SECONDS / 2 + 1)).toBeGreaterThan(globeRotation(TURN_SECONDS / 2));
  });
  it("stays stationary for reduced-motion visitors", () => {
    expect(globeRotation(TURN_SECONDS, true)).toBe(globeRotation(0, true));
  });
  it("includes Australia alongside European and North American users", () => {
    expect(globeUsers.map(user => user.country)).toEqual(["USA", "Canada", "UK", "France", "Germany", "Australia"]);
  });
  it("reveals USA before Canada and the remaining countries one at a time", () => {
    expect(connectionReveal(3.6, 0)).toEqual({ marker: 1, line: 1, house: 1 });
    expect(connectionReveal(3.6, 1)).toEqual({ marker: 0, line: 0, house: 0 });
    globeUsers.forEach((_, index) => {
      expect(connectionReveal(index * CONNECTION_SECONDS + 1.8, index).line).toBeCloseTo(0.5);
      expect(connectionReveal(index * CONNECTION_SECONDS + 1.8, index + 1).marker).toBe(0);
    });
  });
  it("introduces the face before the line and the house after the line arrives", () => {
    expect(connectionReveal(0.3, 0)).toEqual({ marker: 0.5, line: 0, house: 0 });
    expect(connectionReveal(1.8, 0).house).toBe(0);
    expect(connectionReveal(3.3, 0).line).toBe(1);
    expect(connectionReveal(3.3, 0).house).toBeCloseTo(0.5);
  });
  it("shows every connection without animation for reduced motion", () => {
    expect(connectionReveal(0, 5, true)).toEqual({ marker: 1, line: 1, house: 1 });
  });
  it("keeps completed connections visible on the return journey", () => {
    expect(connectionReveal(TURN_SECONDS, 5)).toEqual({ marker: 1, line: 1, house: 1 });
  });
});