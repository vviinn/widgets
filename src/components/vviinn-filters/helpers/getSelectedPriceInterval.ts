import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { isPriceFilter } from "../../../filters";
import { components } from "../../../interfaces/generated";

export const getSelectedPriceInterval = (
  requestFilters: RequestDynamicFilterItem[],
): components["schemas"]["interval"] | undefined => {
  const intervalFilter = requestFilters.find(({ column }) =>
    isPriceFilter(column),
  );
  return intervalFilter?.values[0] as
    | components["schemas"]["interval"]
    | undefined;
};
