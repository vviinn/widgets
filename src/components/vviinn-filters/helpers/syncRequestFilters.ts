import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { SearchStore } from "../../../store/search.store";
import type { ObservableMap } from "@stencil/store";

type OnChangeHandler<T> = ObservableMap<T>["onChange"];

/**
 * Mirrors the store's requestFilters into local component state, empty updates included —
 * a cleared store means nothing is selected, and the mirror has to say so too.
 * Returns the store's dispose function; call it from disconnectedCallback.
 */
export const syncRequestFilters = (
  state: SearchStore,
  onChange: OnChangeHandler<SearchStore>,
  setRequestFilters: (filters: RequestDynamicFilterItem[]) => void,
) => {
  // Copy the array — subFilterSelection edits the mirror in place and must not reach the store.
  const mirror = (filters: RequestDynamicFilterItem[]) =>
    setRequestFilters([...filters]);

  mirror(state.requestFilters);

  return onChange("requestFilters", mirror);
};
