import { subFilterSelection } from "./subFilterSelection";
import { emitRequestFiltersMore } from "./emitRequestFiltersMore";
import {
  DynamicFilter,
  DynamicFilterValue,
  RequestDynamicFilters,
} from "../../../campaign/VPRCampaignService";
import { EventEmitter } from "@stencil/core";
import {
  ChangedFiltersEventData,
  DynamicFilterTrackingData,
} from "../../../recommendation/events";

export const triggerFilter = (
  filterValue: DynamicFilterValue,
  selectedFilter: DynamicFilter,
  requestFilters: RequestDynamicFilters,
  vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>,
  el: HTMLElement,
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>
) => {
  const { filters, action } = subFilterSelection(
    requestFilters,
    selectedFilter,
    filterValue
  );

  vviinnFilterTriggered.emit({
    category: selectedFilter.column,
    action,
    kind: "category",
  });
  vviinnFiltersChanged.emit({ filters, el });
  emitRequestFiltersMore([...filters], el, vviinnFiltersChanged);

  return filters;
};
