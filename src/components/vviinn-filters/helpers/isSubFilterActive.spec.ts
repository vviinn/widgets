import { isSubFilterActive } from "./isSubFilterActive";
import {
  categoricalFilter,
  intervalFilter,
} from "../../../filters/testFixtures";
import type { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";

const applied = (column: string, values: unknown[]): RequestDynamicFilterItem =>
  ({ column, values }) as RequestDynamicFilterItem;

const brand = categoricalFilter("brand", [
  { value: "Mediware", selected: false },
  { value: "Other", selected: false },
]);

describe("isSubFilterActive", () => {
  it("returns false when nothing is applied", () => {
    expect(isSubFilterActive([], "Mediware" as never, brand)).toBe(false);
  });

  it("returns false when the applied filters are missing", () => {
    expect(isSubFilterActive(undefined, "Mediware" as never, brand)).toBe(
      false,
    );
  });

  it("returns false when the facet is missing", () => {
    expect(
      isSubFilterActive(
        [applied("brand", ["Mediware"])],
        "Mediware" as never,
        undefined,
      ),
    ).toBe(false);
  });

  it("matches a plain string value applied on the same column", () => {
    expect(
      isSubFilterActive(
        [applied("brand", ["Mediware"])],
        "Mediware" as never,
        brand,
      ),
    ).toBe(true);
  });

  it("ignores a value applied on another column", () => {
    expect(
      isSubFilterActive(
        [applied("modality", ["Mediware"])],
        "Mediware" as never,
        brand,
      ),
    ).toBe(false);
  });

  it("ignores a value the column does not carry", () => {
    expect(
      isSubFilterActive(
        [applied("brand", ["Other"])],
        "Mediware" as never,
        brand,
      ),
    ).toBe(false);
  });

  // Categorical options reach the helper as { value, label, ... }, not as bare strings.
  it("matches an option object against the applied raw value", () => {
    expect(
      isSubFilterActive(
        [applied("brand", ["Mediware"])],
        { value: "Mediware", label: "Mediware" } as never,
        brand,
      ),
    ).toBe(true);
  });

  it("matches an interval by its bounds rather than by reference", () => {
    const price = intervalFilter("price", [], { start: 0, end: 1000 });

    expect(
      isSubFilterActive(
        [applied("price", [{ start: 100, end: 200 }])],
        { interval: { start: 100, end: 200 } } as never,
        price,
      ),
    ).toBe(true);
  });

  it("rejects an interval whose bounds differ", () => {
    const price = intervalFilter("price", [], { start: 0, end: 1000 });

    expect(
      isSubFilterActive(
        [applied("price", [{ start: 100, end: 200 }])],
        { interval: { start: 100, end: 300 } } as never,
        price,
      ),
    ).toBe(false);
  });

  it("finds the value among several applied on the column", () => {
    expect(
      isSubFilterActive(
        [
          applied("modality", ["OCR"]),
          applied("brand", ["A", "Mediware", "B"]),
        ],
        "Mediware" as never,
        brand,
      ),
    ).toBe(true);
  });
});
