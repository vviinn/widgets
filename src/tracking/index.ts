import { ProductEventType, ResultEventType } from "../recommendation/events";
import { createTrackingEvent } from "./event";
import { Widget } from "vviinn-tracking-client-ts";
import {
  ADD_TO_BASKET_EVENT_TYPE,
  ADD_TO_WISHLIST_EVENT_TYPE,
  FILTER_EVENT_TYPE,
  SEARCH_EVENT_TYPE,
  PRODUCT_CLICK_EVENT_TYPE,
  PRODUCT_LOAD_EVENT_TYPE,
  PRODUCT_VIEW_EVENT_TYPE,
  RESULT_LOAD_EVENT_TYPE,
  RESULT_VIEW_EVENT_TYPE,
  WIDGET_EVENT_TYPE,
} from "./models";

export type { TrackedEvent } from "./models";

export const createResultEventByType = (
  type: ResultEventType,
  widget: Widget,
) => {
  const typ = type === "load" ? RESULT_LOAD_EVENT_TYPE : RESULT_VIEW_EVENT_TYPE;
  return createTrackingEvent({
    widget,
    typ,
  });
};

export const createProductEventByType = (
  type: ProductEventType,
  widget: Widget,
) => {
  const typ =
    type === "load"
      ? PRODUCT_LOAD_EVENT_TYPE
      : type === "view"
        ? PRODUCT_VIEW_EVENT_TYPE
        : PRODUCT_CLICK_EVENT_TYPE;

  return createTrackingEvent({
    widget,
    typ,
  });
};

export const createAddToBasketEvent = (widget: Widget) =>
  createTrackingEvent({
    widget,
    typ: ADD_TO_BASKET_EVENT_TYPE,
  });

export const createAddToWishlistEvent = (widget: Widget) =>
  createTrackingEvent({
    widget,
    typ: ADD_TO_WISHLIST_EVENT_TYPE,
  });

export const createFilterEvent = (widget: Widget) =>
  createTrackingEvent({
    widget,
    typ: FILTER_EVENT_TYPE,
  });

export const createWidgetEvent = (widget: Widget) =>
  createTrackingEvent({
    widget,
    typ: WIDGET_EVENT_TYPE,
  });

export const createImageSearchEvent = createTrackingEvent({
  widget: "VPS",
  typ: SEARCH_EVENT_TYPE,
});
