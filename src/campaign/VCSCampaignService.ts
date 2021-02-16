import { apiGet } from "../network/apiClient";
import { VCSCampaignResponse } from "./VCSCampaignResponse";

export const getVCSRecommendations = (productId: string) => (
  options: RequestInit
) => {
  const url = `product/${productId}/cross-selling-products`;
  return apiGet<VCSCampaignResponse>(url, options);
};
