import { applyResponseFilters, FilterState } from "./applyResponseFilters";
import type { ResponseDynamicFilterItem } from "../../interfaces";

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

const stateWith = (
  dynamicFilters: ResponseDynamicFilterItem[],
  appliedColumn?: string,
): FilterState => ({
  dynamicFilters,
  requestFilters: appliedColumn
    ? [{ column: appliedColumn, values: ["Mediware"] }]
    : [],
});

describe("applyResponseFilters", () => {
  it("keeps the pair intact when the field is absent", () => {
    const facets = [
      categoricalFilter("brand", [{ value: "Mediware", selected: true }]),
    ];
    const state = stateWith(facets, "brand");

    applyResponseFilters(state, undefined);

    expect(state.dynamicFilters).toBe(facets);
    expect(state.requestFilters).toEqual([
      { column: "brand", values: ["Mediware"] },
    ]);
  });

  it("clears both halves when the response reports no facets", () => {
    const state = stateWith(
      [categoricalFilter("brand", [{ value: "Mediware", selected: true }])],
      "brand",
    );

    applyResponseFilters(state, []);

    expect(state.dynamicFilters).toEqual([]);
    expect(state.requestFilters).toEqual([]);
  });

  it("adopts the selection the response reports", () => {
    const state = stateWith([]);
    const response = [
      categoricalFilter("brand", [
        { value: "Mediware", selected: true },
        { value: "Other", selected: false },
      ]),
    ];

    applyResponseFilters(state, response);

    expect(state.dynamicFilters).toBe(response);
    expect(state.requestFilters).toEqual([
      { column: "brand", values: ["Mediware"] },
    ]);
  });

  it("drops an applied filter whose facet the response no longer offers", () => {
    const state = stateWith(
      [categoricalFilter("modality", [{ value: "OCR", selected: true }])],
      "modality",
    );

    applyResponseFilters(state, [
      categoricalFilter("brand", [{ value: "Mediware", selected: false }]),
    ]);

    expect(state.requestFilters).toEqual([]);
  });
});
