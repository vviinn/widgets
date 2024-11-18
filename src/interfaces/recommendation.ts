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

  RequestDynamicFilterItem: components["schemas"]["request-dynamic-filter-item"];

  ResponseDynamicFilterItem:
    | components["schemas"]["response-categorical-filter-item"]
    | components["schemas"]["response-interval-filter-item"];

  DynamicFilterValue: components["schemas"]["interval-filter-value-item"] &
    components["schemas"]["full-color-filter-response"];

  EnergyEfficiencyClass: components["schemas"]["energy-efficiency-class"];
  EnergyCertification: components["schemas"]["energy-certification"];

  BasePrice: components["schemas"]["basePrice"];
}

export type SimilarProductsRequest = Interfaces["SimilarProductsRequest"];
export type CrossSellingRequest = Interfaces["CrossSellingRequest"];
export type RequestStaticFilters = Interfaces["RequestStaticFilters"];
export type Recommendation = Interfaces["Recommendation"];

export type EnergyEfficiencyClass = Interfaces["EnergyEfficiencyClass"];
export type EnergyCertification = Interfaces["EnergyCertification"];
export type EnergyClassIconDirection =
  keyof Interfaces["EnergyCertification"]["classIconUrls"];

export type BasePrice = Interfaces["BasePrice"];
