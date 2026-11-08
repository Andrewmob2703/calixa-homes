import { describe, expect, it } from "vitest";
import { careServices } from "./care-services";

describe("Calixa Care service scope", () => {
  it.each(["Pet Care", "Child Care", "Elder Care"])("does not offer %s", (excluded) => {
    expect(careServices.map((service) => service.t)).not.toContain(excluded);
  });
  it("offers only the six house-maintenance services", () => {
    expect(careServices.map((service) => service.t)).toEqual([
      "Plumbing", "Electrical", "Gardening", "Cleaning", "Painting & Finishing", "Carpentry & Repairs",
    ]);
  });
});