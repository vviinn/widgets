import { Interfaces } from "../interfaces/recommendation";
import { apiPost } from "../network/apiClient";

type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type SimilarProductsResponse = Interfaces["SimilarProductsResponse"];
export type DynamicFilters = Interfaces["DynamicFilters"];
export type DynamicFilter = Interfaces["DynamicFilter"];
export type DynamicFilterValue = Interfaces["DynamicFilterValue"];
export type RequestDynamicFilters = Interfaces["RequestDynamicFilters"];
export type DynamicFilterValueItem = Interfaces["DynamicFilterValueItem"];

export const getVPRRecommendations =
  (body: SimilarProductsRequest) => (options: RequestInit) => {
    const url = "similar-products";

    return apiPost<SimilarProductsResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
