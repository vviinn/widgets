import { components } from "./generated";

export interface Interfaces {
  Recommendation: components["schemas"]["response-product-item"];

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
  DynamicFilterValue: components["schemas"]["interval-filter-value-item"] &
    components["schemas"]["full-color-filter-response"];
  DynamicFilterValueItem: components["schemas"]["request-dynamic-filter-item"];
  RequestDynamicFilters: components["schemas"]["request-dynamic-filters"];

  EnergyEfficiencyClass: components["schemas"]["energy-efficiency-class"];
  EnergyCertification: components["schemas"]["energy-certification"];
}

export type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type CrossSellingRequest = Interfaces["CrossSellingRequest"];
export type RequestStaticFilters = Interfaces["RequestStaticFilters"];
export type Recommendation = Interfaces["Recommendation"];

export type EnergyEfficiencyClass = Interfaces["EnergyEfficiencyClass"];
export type EnergyCertification = Interfaces["EnergyCertification"];
export type EnergyCertificationClassIconDirection =
  keyof Interfaces["EnergyCertification"]["classIconUrls"];
