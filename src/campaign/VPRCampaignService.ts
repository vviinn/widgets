import { apiPost } from "../network/apiClient";
import { VPRCampaignResponse } from "./VPRCampaignResponse";

export const getVPRRecommendations = (body: any) => (options: RequestInit) => {
  const url = "similar-products";

  return apiPost<VPRCampaignResponse>(url, {
    ...options,
    body,
  });
};
