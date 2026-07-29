import { startSearch } from "./searchSequence";

describe("startSearch", () => {
  it("reports the only in-flight request as current", () => {
    const isStale = startSearch("widget");

    expect(isStale()).toBe(false);
  });

  it("marks an earlier request stale once a later one starts", () => {
    const first = startSearch("widget");
    const second = startSearch("widget");

    expect(first()).toBe(true);
    expect(second()).toBe(false);
  });

  it("keeps counting per store", () => {
    const components = startSearch("components");
    startSearch("widget");

    expect(components()).toBe(false);
  });

  it("stays stale once superseded, even after the newer one settles", () => {
    const first = startSearch("shopTheLook");
    const second = startSearch("shopTheLook");

    expect(second()).toBe(false);
    expect(first()).toBe(true);
  });
});
