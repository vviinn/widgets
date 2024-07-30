import { Recommendation } from "../components";
import { components } from "./generated";

export interface SearchInterfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  TextSearchRequest: components["schemas"]["text-search-request"];
  TextSearchResponse: components["schemas"]["text-search-response"];
  RequestDynamicFilterItem: components["schemas"]["request-dynamic-filter-item"];
  ResponseFilterItem: components["schemas"]["response-categorical-filter-item"];
  ProductListingPageRequest: components["schemas"]["product-listing-page-request"];
  ProductListingPageResponse: components["schemas"]["product-listing-page-response"];
}

export type TextSearchRequest = SearchInterfaces["TextSearchRequest"];
export type TextSearchResponse = SearchInterfaces["TextSearchResponse"];

// FIXME: Fis generated types for product-listing-page-request
export type ProductListingPageRequest = {
  resultsCount?: components["schemas"]["resultsCount"];
  staticFilters?: components["schemas"]["request-static-filters"];
};

export type ProductListingPageResponse =
  SearchInterfaces["ProductListingPageResponse"];

export type SearchIdResponse = Recommendation[];

export type RequestDynamicFilterItem =
  SearchInterfaces["RequestDynamicFilterItem"];
export type ResponseFilterItem = SearchInterfaces["ResponseFilterItem"];
