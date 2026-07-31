import { Widget, WidgetEvent } from "vviinn-tracking-client-ts";
import { ProductEvent, ResultEvent } from "../recommendation/events";

const PRODUCT_LOAD_EVENT_TYPE = "product_load_event";
const PRODUCT_VIEW_EVENT_TYPE = "product_view_event";
const PRODUCT_CLICK_EVENT_TYPE = "product_click_event";
const ADD_TO_BASKET_EVENT_TYPE = "add_to_basket_event";
const FILTER_EVENT_TYPE = "filter_event";
const SEARCH_EVENT_TYPE = "search_event";
const WIDGET_EVENT_TYPE = "widget_event";
const RESULT_LOAD_EVENT_TYPE = "result_load_event";
const RESULT_VIEW_EVENT_TYPE = "result_view_event";
const ADD_TO_WISHLIST_EVENT_TYPE = "add_to_wishlist_event";

export {
  PRODUCT_LOAD_EVENT_TYPE,
  PRODUCT_VIEW_EVENT_TYPE,
  PRODUCT_CLICK_EVENT_TYPE,
  ADD_TO_BASKET_EVENT_TYPE,
  FILTER_EVENT_TYPE,
  SEARCH_EVENT_TYPE,
  WIDGET_EVENT_TYPE,
  RESULT_LOAD_EVENT_TYPE,
  RESULT_VIEW_EVENT_TYPE,
  ADD_TO_WISHLIST_EVENT_TYPE,
};

export type WidgetEvents =
  | "product_load_event"
  | "product_click_event"
  | "product_view_event"
  | "filter_event"
  | "search_event"
  | "widget_event"
  | "add_to_basket_event"
  | "add_to_wishlist_event"
  | "result_load_event"
  | "result_view_event";

export type WidgetEventType = {
  widget: Widget;
  typ: WidgetEvents;
};

export type TrackedEvent = WidgetEvent | ProductEvent | ResultEvent;
