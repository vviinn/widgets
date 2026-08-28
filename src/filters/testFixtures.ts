import {
  Interval,
  RequestDynamicFilterItem,
  ResponseCategoricalFilterItem,
  ResponseIntervalFilterItem,
} from "../interfaces";

/** Response- and request-shaped filters for specs, built against the generated types. */
export const categoricalFilter = (
  column: string,
  values: { value: string; selected: boolean }[],
): ResponseCategoricalFilterItem => ({
  type: "categorical",
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

export const intervalFilter = (
  column: string,
  selectedValues: Interval[],
  full: Interval = { start: 0, end: 100 },
): ResponseIntervalFilterItem => ({
  type: "interval",
  column,
  label: column,
  isPrimary: false,
  full,
  selectedValues,
  suggestions: [],
  histogram: [],
});

export const appliedFilter = (
  column: string,
  values: string[] | Interval[],
): RequestDynamicFilterItem => ({ column, values });
