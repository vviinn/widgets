import { components } from "./generated";

export interface Interfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  VisualProductRecommendations: components["schemas"]["visual-product-recommendations"];

  SimilarProductsRequest: components["schemas"]["similar-products-request"];
  SimilarProductsResponse: components["schemas"]["similar-products-response"];

  CrossSellingRequest: components["schemas"]["cross-selling-request"];
  CrossSellingResponse: components["schemas"]["cross-selling-response"];

  RequestStaticFilters: components["schemas"]["request-static-filters"];

  DynamicFilter:
    | components["schemas"]["response-categorical-filter-item"]
    | components["schemas"]["response-interval-filter-item"];
  DynamicFilters: components["schemas"]["response-dynamic-filters"];
  DynamicFilterValue: components["schemas"]["interval-filter-value-item"];
  DynamicFilterValueItem: components["schemas"]["request-dynamic-filter-item"];
  RequestDynamicFilters: components["schemas"]["request-dynamic-filters"];
}

export type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type CrossSellingRequest = Interfaces["CrossSellingRequest"];
export type RequestStaticFilters = Interfaces["RequestStaticFilters"];
