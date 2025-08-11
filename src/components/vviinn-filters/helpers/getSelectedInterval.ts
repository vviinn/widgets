import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { Interval } from "../../../interfaces";

export const getSelectedInterval = (
  requestFilters: RequestDynamicFilterItem[],
  column: string,
): Interval | undefined => {
  const intervalFilter = requestFilters.find(
    (filter) => filter.column === column,
  );
  return intervalFilter?.values[0] as Interval | undefined;
};
