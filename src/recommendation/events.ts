import {
  CampaignTypeTitle,
  CampaignTypeId,
  WidgetType,
} from "../campaign/Campaign";

export type ProductCardEventData = {
  product: string;
  rank: number;
  widgetType: WidgetType;
  campaignTypeId: CampaignTypeId;
  campaignTypeTitle: CampaignTypeTitle;
};

export type WidgetEventData = {
  widgetType: WidgetType;
  campaignTypeId: CampaignTypeId;
  campaignTypeTitle: CampaignTypeTitle;
  id?: string;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
