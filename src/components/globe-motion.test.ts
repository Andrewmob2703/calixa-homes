import { describe, expect, it } from "vitest";
import { globeRotation, globeUsers, TURN_SECONDS } from "./globe-motion";

describe("About globe motion", () => {
  it("completes a full revolution and continues rather than reversing", () => {
    expect(globeRotation(TURN_SECONDS) - globeRotation(0)).toBeCloseTo(2 * Math.PI);
    expect(globeRotation(TURN_SECONDS * 2) - globeRotation(TURN_SECONDS)).toBeCloseTo(2 * Math.PI);
  });
  it("stays stationary for reduced-motion visitors", () => {
    expect(globeRotation(TURN_SECONDS, true)).toBe(globeRotation(0, true));
  });
  it("includes Australia alongside European and North American users", () => {
    expect(globeUsers.map(user => user.country)).toEqual(["USA", "Canada", "UK", "France", "Germany", "Australia"]);
  });
});