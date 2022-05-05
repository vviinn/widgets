import { Widget } from "vviinn-tracking-client-ts";

const PRODUCT_CLICK_EVENT_TYPE = "product_click_event";
const PRODUCT_VIEW_EVENT_TYPE = "product_view_event";
const FILTER_EVENT_EVENT_TYPE = "filter_event";
const SEARCH_EVENT_EVENT_TYPE = "search_event";
const WIDGET_EVENT_EVENT_TYPE = "widget_event";

export {
  PRODUCT_CLICK_EVENT_TYPE,
  PRODUCT_VIEW_EVENT_TYPE,
  FILTER_EVENT_EVENT_TYPE,
  SEARCH_EVENT_EVENT_TYPE,
  WIDGET_EVENT_EVENT_TYPE,
};

export type WidgetEvents =
  | "product_click_event"
  | "product_view_event"
  | "filter_event"
  | "search_event"
  | "widget_event";

export type WidgetEventType = {
  widget: Widget;
  typ: WidgetEvents;
};
