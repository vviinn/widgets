type s = import("./generated").components["schemas"];

// Request Filters
export type RequestStaticFilters = s["request-static-filters"];
export type RequestDynamicFilterItem = s["request-dynamic-filter-item"];
export type RequestCategoricalFilterValue = s["category"];

// Response Filters
export type ResponseDynamicFilters = s["response-dynamic-filters"];
export type ResponseCategoricalFilterItem =
  s["response-categorical-filter-item"];
export type ResponseIntervalFilterItem = s["response-interval-filter-item"];
export type ResponseDynamicFilterItem =
  | s["response-categorical-filter-item"]
  | s["response-interval-filter-item"];
export type ResponseDynamicFilterIntervalItem =
  s["response-interval-filter-item"];

// Filter Values
export type IntervalFilterValueItem = s["interval-filter-value-item"];
export type IntervalFilterValue = s["interval-filter-values"];
export type DynamicFilterValue = s["interval-filter-value-item"] &
  s["full-color-filter-response"];
export type LabelValueItem = s["label-value-item"];
export type Interval = s["interval"];
