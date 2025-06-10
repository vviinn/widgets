import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { components } from "../../../interfaces/generated";
import { isIntervalFilter } from "../../../filters";

export const getSelectedPriceInterval = (
  requestFilters: RequestDynamicFilterItem[],
): components["schemas"]["interval"] | undefined => {
  const intervalFilter = requestFilters.find(({ column }) =>
    isIntervalFilter(column),
  );
  return intervalFilter?.values[0] as
    | components["schemas"]["interval"]
    | undefined;
};
