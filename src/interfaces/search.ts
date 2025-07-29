import { components } from "./generated";

export interface SearchInterfaces {
  VisualSearchRequest: components["schemas"]["visual-search-request"];
  VisualSearchResponse: components["schemas"]["visual-search-response"];
  TextSearchRequest: components["schemas"]["text-search-request"];
  TextSearchResponse: components["schemas"]["text-search-response"];
  ProductListingPageRequest: components["schemas"]["product-listing-page-request"];
  ProductListingPageResponse: components["schemas"]["product-listing-page-response"];
  RequestDynamicFilterItem: components["schemas"]["request-dynamic-filter-item"];

  ResponseDynamicFilters: components["schemas"]["response-dynamic-filters"];
  ResponseCategoricalFilterItem: components["schemas"]["response-categorical-filter-item"];
  ResponseIntervalFilterItem: components["schemas"]["response-interval-filter-item"];
  SearchIdResponse: components["schemas"]["ion-visual-product-search"];

  Rectangle: components["schemas"]["rectangle"];
}

export type TextSearchRequest = SearchInterfaces["TextSearchRequest"];
export type TextSearchResponse = SearchInterfaces["TextSearchResponse"];

export type VisualSearchRequest = SearchInterfaces["VisualSearchRequest"];
export type VisualSearchResponse = SearchInterfaces["VisualSearchResponse"];

export type ProductListingPageRequest =
  SearchInterfaces["ProductListingPageRequest"];

export type ProductListingPageResponse =
  SearchInterfaces["ProductListingPageResponse"];

export type SearchIdResponse = SearchInterfaces["SearchIdResponse"];

export type RequestDynamicFilterItem =
  SearchInterfaces["RequestDynamicFilterItem"];

export type ResponseDynamicFilters = SearchInterfaces["ResponseDynamicFilters"];
export type ResponseCategoricalFilterItem =
  SearchInterfaces["ResponseCategoricalFilterItem"];
export type ResponseIntervalFilterItem =
  SearchInterfaces["ResponseIntervalFilterItem"];

export type Rectangle = SearchInterfaces["Rectangle"];
