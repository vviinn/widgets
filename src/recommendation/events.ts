import { FilterAction } from "vviinn-tracking-client-ts";
import {
  CampaignTypeTitle,
  CampaignTypeId,
  WidgetType,
} from "../campaign/Campaign";
import { ValueObject } from "../network/ion/ValueObject";
import { DetectedObject } from "../searchSession/searchSession";

export type BasicEventData = {
  widgetType: WidgetType;
  campaignTypeId: CampaignTypeId;
  campaignTypeName: CampaignTypeTitle;
  widgetId?: string;
};

export type SelectObjectEventData = BasicEventData & {
  detectedObject: ValueObject<DetectedObject>;
};

export type SelectFilterEventData = BasicEventData & {
  action: FilterAction;
  filterName?: string;
};

export type ProductCardEventData = BasicEventData & {
  productId: string;
  productRank: number;
  productName: string;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
