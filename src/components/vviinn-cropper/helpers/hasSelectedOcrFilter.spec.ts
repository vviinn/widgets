import { hasSelectedOcrFilter } from "./hasSelectedOcrFilter";
import { ResponseDynamicFilterItem } from "../../../interfaces";

const categoricalFilter = (
  column: string,
  values: { value: string; selected: boolean; active?: boolean }[],
): ResponseDynamicFilterItem =>
  ({
    type: "categorical",
    column,
    label: column,
    isPrimary: false,
    values: values.map(({ value, selected, active = true }) => ({
      value,
      label: value,
      active,
      selected,
    })),
  }) as ResponseDynamicFilterItem;

describe("hasSelectedOcrFilter", () => {
  it("returns false for undefined dynamicFilters", () => {
    expect(hasSelectedOcrFilter(undefined)).toBe(false);
  });

  it("returns false for empty dynamicFilters", () => {
    expect(hasSelectedOcrFilter([])).toBe(false);
  });

  it("returns true when modality filter has OCR selected", () => {
    const dynamicFilters = [
      categoricalFilter("modality", [
        { value: "OCR", selected: true },
        { value: "Visual", selected: true },
      ]),
    ];
    expect(hasSelectedOcrFilter(dynamicFilters)).toBe(true);
  });

  it("returns false when OCR is present but not selected, even if active", () => {
    const dynamicFilters = [
      categoricalFilter("modality", [
        { value: "OCR", selected: false, active: true },
      ]),
    ];
    expect(hasSelectedOcrFilter(dynamicFilters)).toBe(false);
  });

  it("returns false when only Visual is selected", () => {
    const dynamicFilters = [
      categoricalFilter("modality", [
        { value: "OCR", selected: false },
        { value: "Visual", selected: true },
      ]),
    ];
    expect(hasSelectedOcrFilter(dynamicFilters)).toBe(false);
  });

  it("returns false for an interval filter on the modality column", () => {
    const dynamicFilters = [
      {
        type: "interval",
        column: "modality",
        label: "modality",
        isPrimary: false,
        full: { start: 0, end: 1 },
        selectedValues: [],
        suggestions: [],
        histogram: [],
      } as unknown as ResponseDynamicFilterItem,
    ];
    expect(hasSelectedOcrFilter(dynamicFilters)).toBe(false);
  });

  it("returns false when dynamicFilters contain only unrelated columns", () => {
    const dynamicFilters = [
      categoricalFilter("brand", [{ value: "OCR", selected: true }]),
    ];
    expect(hasSelectedOcrFilter(dynamicFilters)).toBe(false);
  });
});
