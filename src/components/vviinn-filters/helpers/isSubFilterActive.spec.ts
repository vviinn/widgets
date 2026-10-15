import { isSubFilterActive } from "./isSubFilterActive";
import {
  appliedFilter,
  categoricalFilter,
  intervalFilter,
} from "../../../filters/testFixtures";
import type { DynamicFilterValue } from "../../../campaign/VPRCampaignService";

const option = (raw: unknown) => raw as DynamicFilterValue;

const brand = categoricalFilter("brand", [
  { value: "Mediware", selected: false },
  { value: "Other", selected: false },
]);

const price = intervalFilter("price", [], { start: 0, end: 1000 });

describe("isSubFilterActive", () => {
  it("returns false when nothing is applied", () => {
    expect(isSubFilterActive([], option("Mediware"), brand)).toBe(false);
  });

  it("returns false when the applied filters are missing", () => {
    expect(isSubFilterActive(undefined, option("Mediware"), brand)).toBe(false);
  });

  it("returns false when the facet is missing", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("brand", ["Mediware"])],
        option("Mediware"),
        undefined,
      ),
    ).toBe(false);
  });

  it("matches a plain string value applied on the same column", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("brand", ["Mediware"])],
        option("Mediware"),
        brand,
      ),
    ).toBe(true);
  });

  it("ignores a value applied on another column", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("modality", ["Mediware"])],
        option("Mediware"),
        brand,
      ),
    ).toBe(false);
  });

  it("returns false when the applied value differs", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("brand", ["Other"])],
        option("Mediware"),
        brand,
      ),
    ).toBe(false);
  });

  it("matches an option object against the applied raw value", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("brand", ["Mediware"])],
        option({ value: "Mediware", label: "Mediware" }),
        brand,
      ),
    ).toBe(true);
  });

  it("matches an interval by its bounds rather than by reference", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("price", [{ start: 100, end: 200 }])],
        option({ interval: { start: 100, end: 200 } }),
        price,
      ),
    ).toBe(true);
  });

  it("rejects an interval whose bounds differ", () => {
    expect(
      isSubFilterActive(
        [appliedFilter("price", [{ start: 100, end: 200 }])],
        option({ interval: { start: 100, end: 300 } }),
        price,
      ),
    ).toBe(false);
  });

  it("finds the value among several applied on the column", () => {
    expect(
      isSubFilterActive(
        [
          appliedFilter("modality", ["OCR"]),
          appliedFilter("brand", ["A", "Mediware", "B"]),
        ],
        option("Mediware"),
        brand,
      ),
    ).toBe(true);
  });
});
