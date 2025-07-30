import { ResponseDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import {
  IntervalFilterValue,
  LabelValueItem,
} from "../../../interfaces/search";

export type FilterOptions = LabelValueItem[] | IntervalFilterValue[];

export const getFilterOptions = (
  filter: ResponseDynamicFilterItem,
): FilterOptions => {
  return filter && "values" in filter
    ? filter.values
    : filter && "histogram" in filter
      ? filter.histogram
      : [];
};
