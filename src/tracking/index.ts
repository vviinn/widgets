import { createTrackingEvent } from "./event";
import { filterEvent } from "./filter";
import {
  vprProductClick,
  vprProductView,
  vpsProductClick,
  vpsProductView,
} from "./product";
import { searchEvent } from "./search";
import { vprWidget, vpsWidget } from "./widget";

export const createProductViewVprEvent = createTrackingEvent(vprProductView);
export const createProductViewVpsEvent = createTrackingEvent(vpsProductView);
export const createProductClickVprEvent = createTrackingEvent(vprProductClick);
export const createProductClickVpsEvent = createTrackingEvent(vpsProductClick);
export const createWidgetVprEvent = createTrackingEvent(vprWidget);
export const createWidgetVpsEvent = createTrackingEvent(vpsWidget);
export const createSearchEvent = createTrackingEvent(searchEvent);
export const createFilterEvent = createTrackingEvent(filterEvent);
