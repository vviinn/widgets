import {
  SimilarProductsRequest,
  SimilarProductsResponse,
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
} from "../interfaces";
import { apiPost } from "../network/apiClient";

export type {
  SimilarProductsResponse,
  ResponseDynamicFilterItem,
  DynamicFilterValue,
  RequestDynamicFilterItem,
};

export const getVPRRecommendations =
  (body: SimilarProductsRequest) =>
  (options: RequestInit) =>
  (apiPath?: string) => {
    const url = "similar-products";

    return apiPost<SimilarProductsResponse>(
      url,
      {
        ...options,
        body: JSON.stringify(body),
      },
      apiPath,
    );
  };
