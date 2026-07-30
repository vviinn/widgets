import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { SearchStore } from "../../../store/search.store";
import type { ObservableMap } from "@stencil/store";

type OnChangeHandler<T> = ObservableMap<T>["onChange"];

/**
 * Copies the store's requestFilters into local component state, empty updates included —
 * a cleared store means nothing is selected, and the local copy has to say so too.
 * Returns the store's dispose function; call it from disconnectedCallback.
 */
export const syncRequestFilters = (
  state: SearchStore,
  onChange: OnChangeHandler<SearchStore>,
  setRequestFilters: (filters: RequestDynamicFilterItem[]) => void,
) => {
  // Copy the array so subFilterSelection can swap entries without touching the store's own.
  // The entries stay shared, so its in-place `values` edits do reach the store.
  const applyCopy = (filters: RequestDynamicFilterItem[]) =>
    setRequestFilters([...filters]);

  applyCopy(state.requestFilters);

  return onChange("requestFilters", applyCopy);
};
