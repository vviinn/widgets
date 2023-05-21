import {
  CampaignTypeTitle,
  CampaignTypeId,
  WidgetType,
} from "../campaign/Campaign";

export type BasicEventData = {
  widgetType: WidgetType;
  campaignTypeId: CampaignTypeId;
  campaignTypeTitle: CampaignTypeTitle;
  id?: string;
};

export type ProductCardEventData = BasicEventData & {
  product: string;
  rank: number;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
