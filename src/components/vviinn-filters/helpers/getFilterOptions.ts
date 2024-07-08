import { components } from "../../../interfaces/generated";

import { DynamicFilter } from "../../../campaign/VPRCampaignService";

export const getFilterOptions = (
  filter: DynamicFilter
):
  | components["schemas"]["label-value-item"][]
  | components["schemas"]["interval-filter-values"][] => {
  return filter && "values" in filter
    ? filter.values
    : filter && "histogram" in filter
    ? filter.histogram
    : [];
};
