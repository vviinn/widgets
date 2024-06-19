import { Interfaces } from "../interfaces/recommendation";
import { apiPost } from "../network/apiClient";

type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type SimilarProductsResponse = Interfaces["SimilarProductsResponse"];
export type Filters = Interfaces["Filters"];
export type Filter = Interfaces["Filter"];
export type FilterValue = Interfaces["FilterValue"];
export type RequestFilters = Interfaces["RequestFilters"];

export const getVPRRecommendations =
  (body: SimilarProductsRequest) => (options: RequestInit) => {
    const url = "similar-products";

    return apiPost<SimilarProductsResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
