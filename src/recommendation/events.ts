import {
  FilterAction,
  ProductClickEvent,
  ProductLoadEvent,
  ProductViewEvent,
  ResultLoadEvent,
  ResultViewEvent,
  Widget,
} from "vviinn-tracking-client-ts";
import { ValueObject } from "../network/ion/ValueObject";
import { ErrorKind } from "../error";
import {
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../campaign/VPRCampaignService";
import { Rectangle } from "../interfaces/search";

export type CommonEventData = {
  campaignTypeId: "VPR" | "VPS" | "VCS" | "TPS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Cross-Selling"
    | "Text Product Search";
  widgetId?: string;
  widgetVersion: string;
};

export type BasicEventData = { widget?: Widget } & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type ImageUploadEventData = { isTriggeredByVpsWidget?: boolean } & {
  [K in keyof BasicEventData]: BasicEventData[K];
};

export type TriggerSourceEventData = {
  isTriggeredByVpsWidget: boolean;
};

export type NoResultEventData = {
  reason: ErrorKind;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type SelectObjectEventData = {
  detectedObject: ValueObject<Rectangle>;
  searchArea: Rectangle;
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

export type ResultEvent = ResultLoadEvent | ResultViewEvent;

export type SearchIdEventData = {
  isTriggeredByVpsWidget: boolean;
  searchId: string;
};

export type TextSearchEventData = {
  query: string;
  requestId?: string;
  isTriggeredByVpsWidget?: boolean;
};

export type ChangedFiltersEventData = {
  filters: RequestDynamicFilterItem[];
  el: HTMLElement;
  isTriggeredByVpsWidget?: boolean;
};

export type DynamicFilterTrackingData = {
  action: FilterAction;
  value?: DynamicFilterValue;
  kind?: string;
  isTriggeredByVpsWidget?: boolean;
};

export type DynamicFilterInternalData = DynamicFilterTrackingData & {
  customTrigger?: Widget;
};

export type SearchIdEvent = CustomEvent<SearchIdEventData>;
export type TextSearchEvent = CustomEvent<TextSearchEventData>;
export type ChangedFiltersEvent = CustomEvent<ChangedFiltersEventData>;
export type ResetSelectedFiltersEvent = CustomEvent<TriggerSourceEventData>;
export type ProductCardEvent = CustomEvent<ProductCardEventData>;
export type CrossSellingClickEvent = CustomEvent<CrossSellingClickEventData>;
export type ExtendedFiltersButtonClickedEvent =
  CustomEvent<TriggerSourceEventData>;
