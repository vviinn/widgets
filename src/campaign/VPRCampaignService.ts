import { FetchOptions } from "../network/fetchOptions";
import { request } from "../network/request";
import { VPRCampaignResponse } from "./VPRCampaignResponse";

export const getVPRRecommendations = (productId: string) => (
  options: FetchOptions
) => {
  const recommendationsUrl = `${process.env.RECOMMENDATIONS_URL}${productId}/similar-products`;
  return request<VPRCampaignResponse>(recommendationsUrl, options);
};
