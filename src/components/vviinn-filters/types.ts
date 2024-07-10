import { RequestDynamicFilters } from "../../campaign/VPRCampaignService";

export type FiltersEventData = {
  filters: RequestDynamicFilters;
  el: HTMLElement;
};
