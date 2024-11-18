import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";

export const showActiveOnSubButton = (
  requestFilters: RequestDynamicFilterItem[],
  filterValue: DynamicFilterValue,
  selectedFilter: ResponseDynamicFilterItem
) => {
  if (!selectedFilter || !requestFilters) return false;

  const mainFilter = requestFilters.find(
    ({ column }) => column === selectedFilter.column
  );

  if (!mainFilter) return false;

  return mainFilter.values.some(
    (value) =>
      value === filterValue ||
      value === filterValue.interval ||
      value === filterValue.value
  )
    ? true
    : false;
};
