import {
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../../campaign/VPRCampaignService";

export const subFilterSelection = (
  filters: RequestDynamicFilters,
  { column: selectedColumn }: DynamicFilter,
  filterValue: DynamicFilterValue
) => {
  const value = filterValue.full ?? filterValue;

  const index = filters.findIndex(({ column }) => column === selectedColumn);
  const valueIndex = filters[index]?.values.findIndex((val) => val === value);

  const pushObject = { column: selectedColumn, values: [] };
  if (valueIndex > -1) pushObject.values.splice(valueIndex, 1);
  else pushObject.values.push(value);

  if (index === -1) filters = [...filters, pushObject];
  else {
    filters[index] = pushObject;

    if (filters[index].values.length === 0) {
      filters = [...filters.filter((filter) => filters[index] !== filter)];
    } else {
      filters = [...filters];
    }
  }

  return filters;
};
