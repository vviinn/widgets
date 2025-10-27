import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";
import { isValueMatch } from "./filterValueUtils";

export const isSubFilterActive = (
  requestFilters: RequestDynamicFilterItem[],
  filterValue: DynamicFilterValue,
  selectedFilter: ResponseDynamicFilterItem,
): boolean => {
  if (!requestFilters || !selectedFilter) return false;

  const mainFilter = requestFilters.find(
    ({ column }) => column === selectedFilter.column,
  );

  if (!mainFilter) return false;

  return mainFilter.values.some((value) => isValueMatch(value, filterValue));
};
