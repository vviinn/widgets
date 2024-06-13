import { Interfaces } from "../interfaces/recommendation";
import { apiPost } from "../network/apiClient";

type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
type SimilarProductsResponse = Interfaces["SimilarProductsResponse"];

export const getVPRRecommendations =
  (body: SimilarProductsRequest) => (options: RequestInit) => {
    const url = "similar-products";

    return apiPost<SimilarProductsResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
