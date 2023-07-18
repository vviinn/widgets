import { FilterAction } from "vviinn-tracking-client-ts";
import { ValueObject } from "../network/ion/ValueObject";
import { DetectedObject } from "../searchSession/searchSession";

/* widgetType: WidgetType, 
campaignTypeId: CampaignTypeId, 
campaignTypeName: CampaignTypeTitle */

export type BasicEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetVersion: string;
  widgetId?: string;
};

export type SelectObjectEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetVersion: string;
  widgetId?: string;
  detectedObject: ValueObject<DetectedObject>;
};

export type SelectFilterEventData = {
  widgetType: "VPR" | "VPS";
  campaignTypeId: "VPR" | "VPS" | "VCS";
  campaignTypeName:
    | "Similar Products"
    | "Visual Search"
    | "Products Cross-Selling";
  widgetVersion: string;
  widgetId?: string;
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
  widgetVersion: string;
  widgetId?: string;
  productId: string;
  productRank: number;
  productName: string;
  productType: string;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
