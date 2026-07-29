import {
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../../../interfaces";
import { extractSelectedFilters } from "./extractSelectedFilters";

/**
 * Realigns the applied filters with what the response reports as selected — the response is
 * the source of truth, and a facet it stops offering must stop constraining later requests.
 * A response with no facets says nothing at all, so the current selection stands.
 */
export const reconcileRequestFilters = (
  currentFilters: RequestDynamicFilterItem[],
  dynamicFilters: ResponseDynamicFilterItem[],
): RequestDynamicFilterItem[] =>
  dynamicFilters.length
    ? extractSelectedFilters(dynamicFilters)
    : currentFilters;
