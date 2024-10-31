import {
  FilterAction,
  FilterKind,
  ProductClickEvent,
  ProductLoadEvent,
  ProductViewEvent,
} from "vviinn-tracking-client-ts";
import { ValueObject } from "../network/ion/ValueObject";
import { DetectedObject } from "../searchSession/searchSession";
import { ErrorKind } from "../error";
import {
  DynamicFilter,
  RequestDynamicFilters,
} from "../campaign/VPRCampaignService";

export type BasicEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TSC";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Search Campaign";
  widgetId: string;
  widgetVersion: string;
};

export type NoResultEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TSC";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Search Campaign";
  widgetId: string;
  widgetVersion: string;
  reason: ErrorKind;
};

export type SelectObjectEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TSC";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Search Campaign";
  widgetId: string;
  widgetVersion: string;
  detectedObject: ValueObject<DetectedObject>;
};

export type SelectFilterEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TSC";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Search Campaign";
  widgetId: string;
  widgetVersion: string;
  action: FilterAction;
  kind: FilterKind;
};

export type ProductCardEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TSC";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Search Campaign";
  widgetId: string;
  widgetVersion: string;
  productId: string;
  productRank: number;
  productName: string;
  productType: string;
  clickEvent?: MouseEvent;
  discount?: number;
};

export type CrossSellingClickEventData = {
  productData: ProductCardEventData;
  animationInterval: number;
};

export type ProductEventType = "load" | "view" | "click";
export type ResultEventType = "load" | "view";

export type ProductEvent =
  | ProductLoadEvent
  | ProductClickEvent
  | ProductViewEvent;

export type SearchIdEventData = {
  searchId: string;
};

export type TextSearchEventData = {
  query: string;
};

export type ChangedFiltersEventData = {
  filters: RequestDynamicFilters;
  el: HTMLElement;
};

export type DynamicFiltersEventData = DynamicFilter[];

export type DynamicFilterTrackingData = {
  action: FilterAction;
  kind: string;
};

export type SearchIdEvent = CustomEvent<SearchIdEventData>;
export type TextSearchEvent = CustomEvent<TextSearchEventData>;
export type DynamicFiltersEvent = CustomEvent<DynamicFiltersEventData>;
export type ChangedFiltersEvent = CustomEvent<ChangedFiltersEventData>;
export type ProductCardEvent = CustomEvent<ProductCardEventData>;
export type CrossSellingClickEvent = CustomEvent<CrossSellingClickEventData>;
