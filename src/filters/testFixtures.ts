import {
  Interval,
  ResponseCategoricalFilterItem,
  ResponseIntervalFilterItem,
} from "../interfaces";

type CategoricalValueInput = {
  value: string;
  selected: boolean;
  active?: boolean;
};

/**
 * Response-shaped filters for specs. Built against the generated types, so a schema change
 * fails the build here instead of quietly rotting a copy of the fixture in every spec.
 */
export const categoricalFilter = (
  column: string,
  values: CategoricalValueInput[],
): ResponseCategoricalFilterItem => ({
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
});

export const intervalFilter = (
  column: string,
  selectedValues: Interval[] = [],
  full: Partial<Interval> = { start: 0, end: 100 },
): ResponseIntervalFilterItem => ({
  type: "interval",
  column,
  label: column,
  isPrimary: false,
  // Partial so a spec can neutralize the bounds the way the suggestion-chip path does.
  full: full as Interval,
  selectedValues,
  suggestions: [],
  histogram: [],
});
