import {
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../../../interfaces";
import { extractSelectedFilters } from "./extractSelectedFilters";
import { isIntervalMatch } from "./filterValueUtils";

/** Applied values are either categorical strings or intervals, compared by their bounds. */
const isSameValue = (a: unknown, b: unknown): boolean =>
  typeof a === "string" || typeof b === "string"
    ? a === b
    : isIntervalMatch(a, b);

const isSameColumn = (
  a: RequestDynamicFilterItem,
  b: RequestDynamicFilterItem,
): boolean =>
  a.column === b.column &&
  a.values.length === b.values.length &&
  (a.values as unknown[]).every((value, index) =>
    isSameValue(value, (b.values as unknown[])[index]),
  );

// Both sides are built by extractSelectedFilters from the response, so column and value
// order is stable — a positional walk is enough, no need to sort.
const isSameSelection = (
  a: RequestDynamicFilterItem[],
  b: RequestDynamicFilterItem[],
): boolean =>
  a.length === b.length &&
  a.every((item, index) => isSameColumn(item, b[index]));

/**
 * Realigns the applied filters with what the response reports as selected — the response is
 * the source of truth, and a facet it stops offering must stop constraining later requests.
 * Returns `currentFilters` untouched when the selection is unchanged, so the store's
 * subscribers are not woken for nothing; a response with no facets says nothing at all.
 */
export const reconcileRequestFilters = (
  currentFilters: RequestDynamicFilterItem[],
  dynamicFilters: ResponseDynamicFilterItem[],
): RequestDynamicFilterItem[] => {
  if (!dynamicFilters.length) return currentFilters;

  const reconciled = extractSelectedFilters(dynamicFilters);

  return isSameSelection(currentFilters, reconciled)
    ? currentFilters
    : reconciled;
};
