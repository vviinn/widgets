import { ProductEventType, ResultEventType } from "../recommendation/events";
import { createTrackingEvent } from "./event";
import { filterEvent } from "./filter";
import {
  vprProductLoad,
  vpcProductLoad,
  vprProductClick,
  vpcProductClick,
  vprProductView,
  vpcProductView,
  vprAddToBasket,
  vpcAddToBasket,
  vpsProductClick,
  vpsProductView,
  vpsProductLoad,
  vpsAddToBasket,
  tpsAddToBasket,
} from "./product";
import { searchEvent } from "./search";
import { tpsWidget, vpcWidget, vprWidget, vpsWidget } from "./widget";
import {
  vprResultLoad,
  vpcResultLoad,
  vprResultView,
  vpcResultView,
} from "./result";
import { Widget } from "vviinn-tracking-client-ts";
import {
  PRODUCT_CLICK_EVENT_TYPE,
  PRODUCT_LOAD_EVENT_TYPE,
  PRODUCT_VIEW_EVENT_TYPE,
  RESULT_LOAD_EVENT_TYPE,
  RESULT_VIEW_EVENT_TYPE,
} from "./models";

export const createProductVprEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vprProductLoad);
    case "view":
      return createTrackingEvent(vprProductView);
    case "click":
      return createTrackingEvent(vprProductClick);
  }
};

export const createProductVpcEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vpcProductLoad);
    case "view":
      return createTrackingEvent(vpcProductView);
    case "click":
      return createTrackingEvent(vpcProductClick);
  }
};

export const createProductVpsEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vpsProductLoad);
    case "view":
      return createTrackingEvent(vpsProductView);
    case "click":
      return createTrackingEvent(vpsProductClick);
  }
};

export const createResultVprEventByType = (type: ResultEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vprResultLoad);
    case "view":
      return createTrackingEvent(vprResultView);
  }
};

export const createResultVpcEventByType = (type: ResultEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vpcResultLoad);
    case "view":
      return createTrackingEvent(vpcResultView);
  }
};

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

export const createProductWidgetEventByType = (
  widget: Widget,
  type: ProductEventType,
) => {
  switch (type) {
    case "load":
      return createTrackingEvent({
        widget,
        typ: PRODUCT_LOAD_EVENT_TYPE,
      });
    case "view":
      return createTrackingEvent({
        widget,
        typ: PRODUCT_VIEW_EVENT_TYPE,
      });
    case "click":
      return createTrackingEvent({
        widget,
        typ: PRODUCT_CLICK_EVENT_TYPE,
      });
  }
};

export const createWidgetVprEvent = createTrackingEvent(vprWidget);
export const createWidgetVpsEvent = createTrackingEvent(vpsWidget);
export const createWidgetVpcEvent = createTrackingEvent(vpcWidget);
export const createWidgetTpsEvent = createTrackingEvent(tpsWidget);

export const createSearchEvent = createTrackingEvent(searchEvent);
export const createFilterEvent = createTrackingEvent(filterEvent);

export const createAddToBasketVprEvent = createTrackingEvent(vprAddToBasket);
export const createAddToBasketVpcEvent = createTrackingEvent(vpcAddToBasket);
export const createAddToBasketVpsEvent = createTrackingEvent(vpsAddToBasket);
export const createAddToBasketTpsEvent = createTrackingEvent(tpsAddToBasket);
