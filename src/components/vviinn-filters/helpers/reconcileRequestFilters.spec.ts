import { reconcileRequestFilters } from "./reconcileRequestFilters";
import {
  Interval,
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../../../interfaces";

const categoricalFilter = (
  column: string,
  values: { value: string; selected: boolean }[],
): ResponseDynamicFilterItem => ({
  type: "categorical" as const,
  column,
  label: column,
  isPrimary: false,
  values: values.map(({ value, selected }) => ({
    value,
    label: value,
    active: true,
    selected,
  })),
});

const intervalFilter = (
  column: string,
  selectedValues: Interval[],
): ResponseDynamicFilterItem => ({
  type: "interval" as const,
  column,
  label: column,
  isPrimary: false,
  full: { start: 0, end: 100 },
  selectedValues,
  suggestions: [],
  histogram: [],
});

const applied = (
  column: string,
  values: string[] | Interval[],
): RequestDynamicFilterItem => ({ column, values });

describe("reconcileRequestFilters", () => {
  it("keeps the current filters when the response carries no facets", () => {
    const current = [applied("brand", ["Mediware"])];

    expect(reconcileRequestFilters(current, [])).toBe(current);
  });

  // The bug this helper exists for: a narrowed result set drops the facet entirely,
  // leaving a filter that is applied but has no chip and no dropdown to undo it.
  it("drops an applied filter whose facet the response no longer offers", () => {
    const current = [applied("modality", ["OCR", "Visual"])];
    const response = [
      categoricalFilter("brand", [{ value: "A", selected: false }]),
    ];

    expect(reconcileRequestFilters(current, response)).toEqual([]);
  });

  it("drops an interval the response stops echoing", () => {
    const current = [applied("minimum_price", [{ start: 0, end: 87 }])];
    const response = [intervalFilter("minimum_price", [])];

    expect(reconcileRequestFilters(current, response)).toEqual([]);
  });

  it("adopts categorical and interval selections together", () => {
    const interval: Interval = { start: 10, end: 50 };
    const current = [applied("modality", ["OCR"])];
    const response = [
      intervalFilter("minimum_price", [interval]),
      categoricalFilter("brand", [
        { value: "Mediware", selected: true },
        { value: "Other", selected: false },
      ]),
      categoricalFilter("modality", [{ value: "OCR", selected: false }]),
    ];

    expect(reconcileRequestFilters(current, response)).toEqual([
      { column: "minimum_price", values: [interval] },
      { column: "brand", values: ["Mediware"] },
    ]);
  });

  // Reference identity matters: the store fans out to every subscriber on a new reference,
  // so an unchanged selection must come back as the very same array.
  describe("when the selection is unchanged", () => {
    it("returns the same array for categorical values", () => {
      const current = [applied("brand", ["Mediware", "Other"])];
      const response = [
        categoricalFilter("brand", [
          { value: "Mediware", selected: true },
          { value: "Other", selected: true },
        ]),
      ];

      expect(reconcileRequestFilters(current, response)).toBe(current);
    });

    it("returns the same array for an interval compared by bounds", () => {
      const current = [applied("minimum_price", [{ start: 0, end: 87 }])];
      const response = [
        intervalFilter("minimum_price", [{ start: 0, end: 87 }]),
      ];

      expect(reconcileRequestFilters(current, response)).toBe(current);
    });

    it("detects a changed value in an otherwise identical selection", () => {
      const current = [applied("brand", ["Mediware"])];
      const response = [
        categoricalFilter("brand", [{ value: "Other", selected: true }]),
      ];

      expect(reconcileRequestFilters(current, response)).not.toBe(current);
    });
  });
});
