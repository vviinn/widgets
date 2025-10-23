import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../../../interfaces/interactions";

/**
 * Converts filter value to string format expected by request API.
 * Handles simple values (string/number) and complex objects (color filters).
 */
const valueToString = (val: unknown): string => {
  if (typeof val === "string" || typeof val === "number") return String(val);
  if (typeof val === "object" && val !== null && "value" in val) {
    return String((val as { value: unknown }).value);
  }
  return String(val);
};

/**
 * Extracts selected filter values from backend response filters and converts them to the request filter format.
 * Used to initialize requestFilters when backend returns filters with selected: true
 */
export const extractSelectedFilters = (
  dynamicFilters: ResponseDynamicFilterItem[],
): RequestDynamicFilterItem[] => {
  if (!dynamicFilters?.length) return [];

  return dynamicFilters.reduce((acc, filter) => {
    if (filter.type === "categorical" && "values" in filter) {
      const selectedValues = filter.values
        .filter((item) => item.selected === true)
        .map((item) => valueToString(item.value));

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
