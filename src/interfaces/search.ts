import { components } from "./generated";

export interface SearchInterfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  TextSearchRequest: components["schemas"]["multi-search-request"];
  TextSearchResponse: components["schemas"]["multi-search-response"];
  ResponseFilterItem: components["schemas"]["response-filter-item"];
  RequestFilterItem: components["schemas"]["request-filters"];
}
