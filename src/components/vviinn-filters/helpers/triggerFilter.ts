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
  });

  vviinnFiltersChanged.emit({
    filters,
    el,
    isTriggeredByVpsWidget,
  });

  return filters;
};

export const triggerResetFilters = (
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  isTriggeredByVpsWidget?: boolean
) => {
  // TODO: #37391 Implement the reset logic
  // vviinnFilterTriggered.emit({
  //   action: "reset",
  // });

  vviinnFiltersChanged.emit({
    filters: [],
    el,
    isTriggeredByVpsWidget,
  });
};
