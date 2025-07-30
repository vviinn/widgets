import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { components } from "../../../interfaces/generated";

export const getSelectedInterval = (
  requestFilters: RequestDynamicFilterItem[],
  column: string,
): components["schemas"]["interval"] | undefined => {
  const intervalFilter = requestFilters.find(
    (filter) => filter.column === column,
  );
  return intervalFilter?.values[0] as
    | components["schemas"]["interval"]
    | undefined;
};
