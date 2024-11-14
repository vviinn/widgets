import { components } from "../../../interfaces/generated";

import { DynamicFilter } from "../../../campaign/VPRCampaignService";

export type FilterOptions =
  | components["schemas"]["label-value-item"][]
  | components["schemas"]["interval-filter-values"][];

export const getFilterOptions = (filter: DynamicFilter): FilterOptions => {
  return filter && "values" in filter
    ? filter.values
    : filter && "histogram" in filter
    ? filter.histogram
    : [];
};
