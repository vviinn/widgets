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
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>,
  el: HTMLElement,
  triggeredByVpsWidget?: boolean
) => {
  // TODO: #37391 Implement the reset event
  // vviinnFilterTriggered.emit({
  //   action: "reset",
  // });

  vviinnFiltersChanged.emit({
    filters: [],
    el,
    triggeredByVpsWidget,
  });
};
