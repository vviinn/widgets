import {
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../../campaign/VPRCampaignService";

export const showActiveOnSubButton = (
  requestFilters: RequestDynamicFilters,
  filterValue: DynamicFilterValue,
  selectedFilter: DynamicFilter
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
