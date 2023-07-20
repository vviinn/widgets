import { FilterAction } from "vviinn-tracking-client-ts";
import { ValueObject } from "../network/ion/ValueObject";
import { DetectedObject } from "../searchSession/searchSession";

export type BasicEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetId: string;
  widgetVersion: string;
};

export type SelectObjectEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetId: string;
  widgetVersion: string;
  detectedObject: ValueObject<DetectedObject>;
};

export type SelectFilterEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetId: string;
  widgetVersion: string;
  action: FilterAction;
  filterName?: string;
};

export type ProductCardEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetId: string;
  widgetVersion: string;
  productId: string;
  productRank: number;
  productName: string;
  productType: string;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
