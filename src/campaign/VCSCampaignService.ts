import { apiPost } from "../network/apiClient";
import { VCSCampaignResponse } from "./VCSCampaignResponse";

export const getVCSRecommendations = (body: any) => (options: RequestInit) => {
  const url = "cross-selling";

  return apiPost<VCSCampaignResponse>(url, {
    ...options,
    body,
  });
};
