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

type TriggerResetFiltersParams = {
  vviinnFilterTriggered: EventEmitter<DynamicFilterTrackingData>;
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  el: HTMLElement;
  isTriggeredByVpsWidget?: boolean;
};

type TriggerFilterParams = TriggerResetFiltersParams & {
  filterValue: DynamicFilterValue;
  selectedFilter: ResponseDynamicFilterItem;
  requestFilters: RequestDynamicFilterItem[];
};

export const triggerFilter = ({
  filterValue,
  selectedFilter,
  requestFilters,
  vviinnFilterTriggered,
  vviinnFiltersChanged,
  el,
  isTriggeredByVpsWidget,
}: TriggerFilterParams) => {
  const { filters, action } = subFilterSelection(
    requestFilters,
    selectedFilter,
    filterValue,
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

export const triggerResetFilters = ({
  vviinnFilterTriggered,
  vviinnFiltersChanged,
  el,
  isTriggeredByVpsWidget,
}: TriggerResetFiltersParams) => {
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
