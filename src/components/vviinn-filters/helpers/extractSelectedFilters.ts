import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../../../interfaces/interactions";
import { valueToString } from "./filterValueUtils";

/**
  Extracts selected filter values from backend response filters and converts them to the request filter format.
  Used to initialize requestFilters when backend returns filters with selected: true
 */
export const extractSelectedFilters = (
  dynamicFilters: ResponseDynamicFilterItem[],
): RequestDynamicFilterItem[] => {
  if (!dynamicFilters?.length) return [];

  return dynamicFilters.reduce((acc, filter) => {
    if (filter.type === "categorical" && "values" in filter) {
      const selectedValues = filter.values
        .filter((item) => item.selected === true && item.value != null)
        .map((item) => valueToString(item.value))
        .filter((val): val is string => val !== null);

      if (selectedValues.length > 0) {
        acc.push({ column: filter.column, values: selectedValues });
      }
    } else if (filter.type === "interval" && "selectedValues" in filter) {
      const { selectedValues } = filter;
      if (selectedValues?.length > 0) {
        acc.push({ column: filter.column, values: selectedValues });
      }
    }

    return acc;
  }, [] as RequestDynamicFilterItem[]);
};
