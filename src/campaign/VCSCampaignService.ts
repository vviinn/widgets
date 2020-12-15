import { FetchOptions } from "../network/fetchOptions";
import { request } from "../network/request";
import { VCSCampaignResponse } from "./VCSCampaignResponse";

export const getVCSRecommendations = (productId: string) => (
  options: FetchOptions
) => {
  const recommendationsUrl = `${process.env.RECOMMENDATIONS_URL}${productId}/cross-selling-products`;
  return request<VCSCampaignResponse>(recommendationsUrl, options);
};
