import { Filter } from "../../../campaign/VPRCampaignService";

export const getFilterOptions = (filter: Filter) => {
  return filter && "values" in filter
    ? filter.values
    : filter && "suggestions" in filter
    ? filter.suggestions
    : [];
};
