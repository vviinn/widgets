import { DynamicFilter } from "../../../campaign/VPRCampaignService";

export const getFilterOptions = (filter: DynamicFilter) => {
  return filter && "values" in filter
    ? filter.values
    : filter && "suggestions" in filter
    ? filter.suggestions
    : [];
};
