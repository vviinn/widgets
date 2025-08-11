import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";
import { FilterAction } from "vviinn-tracking-client-ts";
import { Interval, ResponseIntervalFilterItem } from "../../../interfaces";

type ValueRequest = string & { start?: number; end?: number };

const isFullRangeInterval = (
  selectedFilter: ResponseDynamicFilterItem,
  interval: Interval,
): boolean => {
  if (selectedFilter.type !== "interval") return false;

  const intervalFilter = selectedFilter as ResponseIntervalFilterItem;
  const fullRange = intervalFilter.full;

  return interval.start === fullRange.start && interval.end === fullRange.end;
};

export const subFilterSelection = (
  filters: RequestDynamicFilterItem[],
  selectedFilter: ResponseDynamicFilterItem,
  filterValue: DynamicFilterValue,
) => {
  const selectedColumn = selectedFilter.column;
  const value = filterValue.interval ?? filterValue.value ?? filterValue;
  const index = filters.findIndex(({ column }) => column === selectedColumn);

  if (selectedFilter.type === "interval" && filterValue.interval) {
    const interval = filterValue.interval as Interval;

    if (isFullRangeInterval(selectedFilter, interval)) {
      if (index > -1) {
        filters = [
          ...filters.filter((filter) => filter.column !== selectedColumn),
        ];
        return { filters, action: "deselect" as FilterAction };
      } else {
        return { filters: [...filters], action: "deselect" as FilterAction };
      }
    }
  }

  const valueIndex = filters[index]?.values.findIndex((val) => val === value);
  const action: FilterAction =
    valueIndex == -1 || index == -1 ? "select" : "deselect";

  const pushObject =
    index === -1 || selectedFilter?.type === "interval"
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

  return { filters, action };
};
