import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { SearchStore } from "../../../store/search.store";
import { OnChangeHandler } from "@stencil/store/dist/types";

/**
 * Syncs local component requestFilters state with the store's requestFilters in case there are response filters with * selected: true.
 */
export const syncRequestFilters = (
  state: SearchStore,
  onChange: OnChangeHandler<SearchStore>,
  setRequestFilters: (filters: RequestDynamicFilterItem[]) => void,
) => {
  if (state.requestFilters?.length > 0) {
    setRequestFilters([...state.requestFilters]);
  }

  onChange("requestFilters", (newValue) => {
    if (newValue?.length > 0) {
      setRequestFilters([...newValue]);
    }
  });
};
