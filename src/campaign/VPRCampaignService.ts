import { apiGet } from "../network/apiClient";
import { VPRCampaignResponse } from "./VPRCampaignResponse";

export const getVPRRecommendations = (productId: string) => (
  options: RequestInit
) => {
  const url = `product/${productId}/similar-products`;
  return apiGet<VPRCampaignResponse>(url, options);
};
