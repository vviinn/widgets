import { components } from "./generated";

export interface Interfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  VisualProductRecommendations: components["schemas"]["visual-product-recommendations"];

  SimilarProductsRequest: components["schemas"]["similar-products-request"];
  SimilarProductsResponse: components["schemas"]["similar-products-response"];

  CrossSellingRequest: components["schemas"]["cross-selling-request"];
  CrossSellingResponse: components["schemas"]["cross-selling-response"];

  StaticFilters: components["schemas"]["request-static-filters"];
}

export type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type CrossSellingRequest = Interfaces["CrossSellingRequest"];
export type StaticFilters = Interfaces["StaticFilters"];
