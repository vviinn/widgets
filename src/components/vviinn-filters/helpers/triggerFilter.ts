import { subFilterSelection } from "./subFilterSelection";
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
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  triggeredByVpsWidget?: boolean
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

  vviinnFiltersChanged.emit({
    filters,
    el,
    triggeredByVpsWidget,
  });

  return filters;
};

export const triggerResetFilters = (
  filters: RequestDynamicFilters,
  vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>,
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  triggeredByVpsWidget?: boolean
) => {
  vviinnFilterTriggered.emit({
    kind: "reset",
    action: "deselect",
  });

  vviinnFiltersChanged.emit({
    filters,
    el,
    triggeredByVpsWidget,
  });

  return filters;
};
