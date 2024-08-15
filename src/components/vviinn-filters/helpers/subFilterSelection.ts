import {
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../../campaign/VPRCampaignService";

type ValueRequest = string & { start?: number; end?: number };

export const subFilterSelection = (
  filters: RequestDynamicFilters,
  { column: selectedColumn }: DynamicFilter,
  filterValue: DynamicFilterValue
) => {
  const value = filterValue.interval ?? filterValue.value ?? filterValue;
  const index = filters.findIndex(({ column }) => column === selectedColumn);
  const valueIndex = filters[index]?.values.findIndex((val) => val === value);

  const pushObject =
    index === -1 || selectedColumn === "price"
      ? { column: selectedColumn, values: [] }
      : filters[index];

  if (valueIndex > -1) pushObject.values.splice(valueIndex, 1);
  else pushObject.values.push(value as ValueRequest);

  if (index === -1) {
    filters = [...filters, pushObject];
    if (document.getElementById("filters-footer"))
      document.getElementById("filters-footer").scrollLeft = 0;
  } else {
    filters[index] = pushObject;

    if (filters[index].values.length === 0) {
      filters = [...filters.filter((filter) => filters[index] !== filter)];
    } else {
      filters = [...filters];
    }
  }

  return filters;
};
