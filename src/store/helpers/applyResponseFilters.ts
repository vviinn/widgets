import { extractSelectedFilters } from "../../components/vviinn-filters/helpers/extractSelectedFilters";
import type {
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../../interfaces";

/** The two fields this owns; a subset of SearchStore so the rule can be tested on its own. */
export type FilterState = {
  dynamicFilters: ResponseDynamicFilterItem[];
  requestFilters: RequestDynamicFilterItem[];
};

/**
 * The response is the source of truth: a facet it stops offering stops being applied. Both
 * fields move together here, or a filter outlives the facet that could undo it.
 *
 * An absent field says nothing and leaves the pair alone; an empty one clears both halves.
 */
export const applyResponseFilters = (
  state: FilterState,
  responseFilters: ResponseDynamicFilterItem[] | undefined,
) => {
  if (!responseFilters) return;

  state.dynamicFilters = responseFilters;
  state.requestFilters = extractSelectedFilters(responseFilters);
};
