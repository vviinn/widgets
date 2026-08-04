import {
  FilterAction,
  ProductClickEvent,
  ProductLoadEvent,
  ProductViewEvent,
  ResultLoadEvent,
  ResultViewEvent,
  Widget,
} from "vviinn-tracking-client-ts";
import { ErrorCode, ErrorKind } from "../error";
import {
  DynamicFilterValue,
  RequestDynamicFilterItem,
  ResponseDynamicFilterItem,
} from "../campaign/VPRCampaignService";
import { Rectangle } from "../interfaces";
import { Recommendation } from "../interfaces/product";
import { SearchStoreName } from "../store/search.store";

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

export type RedirectSource = "text-search" | "visual-search" | "auto-suggest";

export type RedirectEventData = {
  url: string;
  source: RedirectSource;
  query?: string;
  searchId?: string;
  widget?: Widget;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type ImageUploadEventData = { isTriggeredByVpsWidget?: boolean } & {
  [K in keyof BasicEventData]: BasicEventData[K];
};

export type TriggerSourceEventData = {
  isTriggeredByVpsWidget: boolean;
  triggerElement?: HTMLElement;
};

export type NoResultEventData = {
  reason: ErrorKind;
  errorMessage?: string;
  errorCode?: ErrorCode;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type SelectObjectEventData = {
  detectedObject: Rectangle;
  searchArea: Rectangle;
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
  filter?: ResponseDynamicFilterItem;
};

export type SearchSuccessEventData = {
  results: Recommendation[];
  dynamicFilters: ResponseDynamicFilterItem[];
  detectedObjects?: Rectangle[];
  requestId: string;
  query?: string;
  storeName: SearchStoreName;
} & {
  [K in keyof CommonEventData]: CommonEventData[K];
};

export type SearchIdEvent = CustomEvent<SearchIdEventData>;
export type TextSearchEvent = CustomEvent<TextSearchEventData>;
export type ChangedFiltersEvent = CustomEvent<ChangedFiltersEventData>;
export type ResetSelectedFiltersEvent = TriggerSourceEvent;
export type ProductCardEvent = CustomEvent<ProductCardEventData>;
export type CrossSellingClickEvent = CustomEvent<CrossSellingClickEventData>;
export type TriggerSourceEvent = CustomEvent<TriggerSourceEventData>;
export type SearchSuccessEvent = CustomEvent<SearchSuccessEventData>;
