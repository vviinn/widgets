import { components } from "../../../interfaces/generated";

import { DynamicFilter } from "../../../campaign/VPRCampaignService";

export type GetFilterOptions =
  | components["schemas"]["label-value-item"][]
  | components["schemas"]["interval-filter-values"][];

export const getFilterOptions = (filter: DynamicFilter): GetFilterOptions => {
  return filter && "values" in filter
    ? filter.values
    : filter && "histogram" in filter
    ? filter.histogram
    : [];
};
