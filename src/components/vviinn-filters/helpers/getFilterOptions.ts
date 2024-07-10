import { DynamicFilter } from "../../../campaign/VPRCampaignService";

export const getFilterOptions = (filter: DynamicFilter) => {
  return filter && "values" in filter
    ? filter.values
    : filter && "histogram" in filter
    ? filter.histogram
    : [];
};
