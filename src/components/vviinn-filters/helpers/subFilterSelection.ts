import {
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../../campaign/VPRCampaignService";

export const subFilterSelection = (
  filters: RequestDynamicFilters,
  seletedFilter: DynamicFilter,
  filterValue: DynamicFilterValue
) => {
  const index = filters.findIndex(
    (filter) => filter.column === seletedFilter.column
  );
  const value = filterValue.interval ?? filterValue;
  const pushObject = {
    column: seletedFilter.column,
    values: [],
  };
  pushObject.values.push(value);
  if (index !== -1) {
    filters[index] = pushObject;
    filters = [...filters];
  } else {
    filters = [...filters, pushObject];
  }
  return filters;
};
