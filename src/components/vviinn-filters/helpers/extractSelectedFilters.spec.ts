import { extractSelectedFilters } from "./extractSelectedFilters";
import type { Interval, ResponseDynamicFilterItem } from "../../../interfaces";

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

describe("extractSelectedFilters", () => {
  it("returns nothing for an empty response", () => {
    expect(extractSelectedFilters([])).toEqual([]);
  });

  it("omits a facet with nothing selected", () => {
    const response = [
      categoricalFilter("brand", [{ value: "A", selected: false }]),
    ];

    expect(extractSelectedFilters(response)).toEqual([]);
  });

  it("omits an interval facet the response stops echoing", () => {
    expect(
      extractSelectedFilters([intervalFilter("minimum_price", [])]),
    ).toEqual([]);
  });

  it("takes only the selected values of a categorical facet", () => {
    const response = [
      categoricalFilter("brand", [
        { value: "Mediware", selected: true },
        { value: "Other", selected: false },
      ]),
    ];

    expect(extractSelectedFilters(response)).toEqual([
      { column: "brand", values: ["Mediware"] },
    ]);
  });

  it("takes the echoed bounds of an interval facet", () => {
    const interval: Interval = { start: 0, end: 87 };

    expect(
      extractSelectedFilters([intervalFilter("minimum_price", [interval])]),
    ).toEqual([{ column: "minimum_price", values: [interval] }]);
  });

  // Result order follows the response's facet order, not the order values were clicked.
  it("collects categorical and interval facets together", () => {
    const interval: Interval = { start: 10, end: 50 };
    const response = [
      intervalFilter("minimum_price", [interval]),
      categoricalFilter("brand", [
        { value: "Mediware", selected: true },
        { value: "Other", selected: false },
      ]),
      categoricalFilter("modality", [{ value: "OCR", selected: false }]),
    ];

    expect(extractSelectedFilters(response)).toEqual([
      { column: "minimum_price", values: [interval] },
      { column: "brand", values: ["Mediware"] },
    ]);
  });
});
