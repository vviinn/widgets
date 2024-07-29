import { Recommendation } from "../components";
import { components } from "./generated";

export interface SearchInterfaces {
  VisualProductSearch: components["schemas"]["response-product-item"];
  TextSearchRequest: components["schemas"]["text-search-request"];
  TextSearchResponse: components["schemas"]["text-search-response"];
  ResponseFilterItem: components["schemas"]["response-categorical-filter-item"];
}

export type TextSearchResponse = SearchInterfaces["TextSearchResponse"];
export type SearchIdResponse = Recommendation[];

export type RequestFilterItem = {
  column: string;
  values: string[];
};

export type ResponseFilterItem = SearchInterfaces["ResponseFilterItem"];
