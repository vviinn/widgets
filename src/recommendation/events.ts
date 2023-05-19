import { CampaignTitle, CampaignTypeId } from "../campaign/Campaign";

export type ProductCardEventData = {
  product: string;
  rank: number;
  campaignTypeId: CampaignTypeId;
  campaignTitle: CampaignTitle;
};

export type WidgetEventData = {
  campaignTypeId: CampaignTypeId;
  campaignTitle: CampaignTitle;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
