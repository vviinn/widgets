import { components } from "./generated";

export interface SearchInterfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  MultiSearchRequest: components["schemas"]["multi-search-request"];
  MultiSearchResponse: components["schemas"]["multi-search-response"];
  ResponseFilterItem: components["schemas"]["response-filter-item"];
  RequestFilterItem: components["schemas"]["request-filters"];
}
