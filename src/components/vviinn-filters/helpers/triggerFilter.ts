import { subFilterSelection } from "./subFilterSelection";
import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";
import { EventEmitter } from "@stencil/core";
import {
  ChangedFiltersEventData,
  DynamicFilterTrackingData,
} from "../../../recommendation/events";

export const triggerFilter = (
  filterValue: DynamicFilterValue,
  selectedFilter: ResponseDynamicFilterItem,
  requestFilters: RequestDynamicFilterItem[],
  vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>,
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  isTriggeredByVpsWidget?: boolean
) => {
  const { filters, action } = subFilterSelection(
    requestFilters,
    selectedFilter,
    filterValue
  );

  vviinnFilterTriggered.emit({
    kind: selectedFilter.column,
    action,
    isTriggeredByVpsWidget,
  });

  vviinnFiltersChanged.emit({
    filters,
    el,
    isTriggeredByVpsWidget,
  });

  return filters;
};

export const triggerResetFilters = (
  vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>,
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  isTriggeredByVpsWidget?: boolean
) => {
  vviinnFilterTriggered.emit({
    action: "reset",
    isTriggeredByVpsWidget,
  });

  vviinnFiltersChanged.emit({
    filters: [],
    el,
    isTriggeredByVpsWidget,
  });
};
