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
} from "./product";
import { searchEvent } from "./search";
import { vpcWidget, vprWidget, vpsWidget } from "./widget";
import {
  vprResultLoad,
  vpcResultLoad,
  vpsResultLoad,
  vprResultView,
  vpcResultView,
  vpsResultView,
} from "./result";

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

export const createResultVpsEventByType = (type: ResultEventType) => {
  switch (type) {
    case "load":
      return createTrackingEvent(vpsResultLoad);
    case "view":
      return createTrackingEvent(vpsResultView);
  }
};

export const createWidgetVprEvent = createTrackingEvent(vprWidget);
export const createWidgetVpsEvent = createTrackingEvent(vpsWidget);
export const createWidgetVpcEvent = createTrackingEvent(vpcWidget);

export const createSearchEvent = createTrackingEvent(searchEvent);
export const createFilterEvent = createTrackingEvent(filterEvent);

export const createAddToBasketVprEvent = createTrackingEvent(vprAddToBasket);
export const createAddToBasketVpcEvent = createTrackingEvent(vpcAddToBasket);
