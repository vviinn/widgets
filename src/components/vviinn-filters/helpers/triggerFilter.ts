import { subFilterSelection } from "./subFilterSelection";
import {
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../../../campaign/VPRCampaignService";
import { EventEmitter } from "@stencil/core";
import {
  ChangedFiltersEventData,
  DynamicFilterInternalData,
} from "../../../recommendation/events";

type TriggerResetFiltersParams = {
  el: HTMLElement;
  isTriggeredByVpsWidget: boolean;
  vviinnFilterTriggered: EventEmitter<DynamicFilterInternalData>;
  vviinnFiltersChanged?: EventEmitter<ChangedFiltersEventData>;
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
    value: filterValue,
    filter: selectedFilter,
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

  vviinnFiltersChanged &&
    vviinnFiltersChanged.emit({
      filters: [],
      el,
      isTriggeredByVpsWidget,
    });
};
