import {
  FilterAction,
  ProductClickEvent,
  ProductLoadEvent,
  ProductViewEvent,
  Widget,
} from "vviinn-tracking-client-ts";
import { ValueObject } from "../network/ion/ValueObject";
import { DetectedObject } from "../searchSession/searchSession";
import { ErrorKind } from "../error";
import {
  ResponseDynamicFilterItem,
  RequestDynamicFilterItem,
} from "../campaign/VPRCampaignService";

type CommonEventData = {
  widgetType: "VPR" | "VPS" | "VCS" | "TPS";
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TPS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Product Search";
  widgetId: string;
  widgetVersion: string;
};

export type BasicEventData = { widget?: Widget } & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type NoResultEventData = {
  reason: ErrorKind;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type SelectObjectEventData = {
  detectedObject: ValueObject<DetectedObject>;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type SelectFilterEventData = {
  action: FilterAction;
  kind: string;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type ProductCardEventData = {
  productId: string;
  productRank: number;
  productName: string;
  productType: string;
  clickEvent?: MouseEvent;
  discount?: number;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
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
  filters: RequestDynamicFilterItem[];
  el: HTMLElement;
  isTriggeredByVpsWidget?: boolean;
};

export type ResetSelectedFiltersEventData = {
  isTriggeredByVpsWidget: boolean;
};

export type DynamicFiltersEventData = ResponseDynamicFilterItem[];

export type DynamicFilterTrackingData = {
  action: FilterAction;
  kind: string;
};

export type SearchIdEvent = CustomEvent<SearchIdEventData>;
export type TextSearchEvent = CustomEvent<TextSearchEventData>;
export type DynamicFiltersEvent = CustomEvent<DynamicFiltersEventData>;
export type ChangedFiltersEvent = CustomEvent<ChangedFiltersEventData>;
export type ResetSelectedFiltersEvent =
  CustomEvent<ResetSelectedFiltersEventData>;
export type ProductCardEvent = CustomEvent<ProductCardEventData>;
export type CrossSellingClickEvent = CustomEvent<CrossSellingClickEventData>;
