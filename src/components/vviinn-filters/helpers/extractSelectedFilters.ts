import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
  Interval,
} from "../../../interfaces/interactions";
import { valueToString } from "./filterValueUtils";

const getSelectedValues = (
  filter: ResponseDynamicFilterItem,
): string[] | Interval[] => {
  if (filter.type === "categorical" && "values" in filter) {
    return filter.values
      .filter((item) => !!item.selected && !!valueToString(item.value))
      .map((item) => valueToString(item.value));
  }

  if (filter.type === "interval" && "selectedValues" in filter) {
    return filter.selectedValues ?? [];
  }

  return [];
};

/**
  Extracts selected filter values from backend response filters and converts them to the request filter format.
  Used to initialize requestFilters when backend returns filters with selected: true
 */
export const extractSelectedFilters = (
  dynamicFilters: ResponseDynamicFilterItem[],
): RequestDynamicFilterItem[] => {
  if (!dynamicFilters?.length) return [];

  return dynamicFilters.reduce((acc, filter) => {
    const selectedValues = getSelectedValues(filter);

    if (selectedValues?.length > 0) {
      acc.push({ column: filter.column, values: selectedValues as any });
    }

    return acc;
  }, []);
};
