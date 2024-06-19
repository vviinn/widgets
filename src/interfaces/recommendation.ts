import { components } from "./generated";

export interface Interfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  VisualProductRecommendations: components["schemas"]["visual-product-recommendations"];

  SimilarProductsRequest: components["schemas"]["similar-products-request"];
  SimilarProductsResponse: components["schemas"]["similar-products-response"];

  CrossSellingRequest: components["schemas"]["cross-selling-request"];
  CrossSellingResponse: components["schemas"]["cross-selling-response"];

  Filter:
    | components["schemas"]["response-categorical-filter-item"]
    | components["schemas"]["response-interval-filter-item"];
  Filters: components["schemas"]["response-filters"];
  FilterValue: components["schemas"]["interval-suggestion"];
  RequestFilters: components["schemas"]["request-filters"];
}
