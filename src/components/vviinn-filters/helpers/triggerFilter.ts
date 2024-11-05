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
    kind: selectedFilter.column,
    action,
  });
  emitRequestFiltersMore([...filters], el, vviinnFiltersChanged);

  return filters;
};
