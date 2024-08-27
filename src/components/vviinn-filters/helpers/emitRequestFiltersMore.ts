import { EventEmitter } from "@stencil/core";
import { RequestDynamicFilters } from "../../../campaign/VPRCampaignService";
import { ChangedFiltersEventData } from "../../../recommendation/events";

export const emitRequestFiltersMore = (
  requestFilters: RequestDynamicFilters,
  el: HTMLElement,
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>
) => {
  vviinnFiltersChanged.emit({ filters: requestFilters, el });
};
