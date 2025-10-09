import { apiPost } from "../network/apiClient";
import { CrossSellingRequest, CrossSellingResponse } from "../interfaces";

export type { CrossSellingResponse };

export const getVCSRecommendations =
  (body: CrossSellingRequest) => (options: RequestInit) => {
    const url = "cross-selling";

    return apiPost<CrossSellingResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
