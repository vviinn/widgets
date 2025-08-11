import { 
  SimilarProductsRequest, 
  SimilarProductsResponse 
} from "../interfaces/discovery";
import { 
  ResponseDynamicFilterItem, 
  DynamicFilterValue, 
  RequestDynamicFilterItem 
} from "../interfaces/filter";
import { apiPost } from "../network/apiClient";

export type { SimilarProductsResponse, ResponseDynamicFilterItem, DynamicFilterValue, RequestDynamicFilterItem };

export const getVPRRecommendations =
  (body: SimilarProductsRequest) => (options: RequestInit) => {
    const url = "similar-products";

    return apiPost<SimilarProductsResponse>(url, {
      ...options,
      body: JSON.stringify(body),
    });
  };
