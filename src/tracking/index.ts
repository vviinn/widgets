import { createTrackingEvent } from "./event";
import {
  vprProductClick,
  vprProductView,
  vpsProductClick,
  vpsProductView,
} from "./product";

export const createProductViewVprEvent = createTrackingEvent(vprProductView);
export const createProductViewVpsEvent = createTrackingEvent(vpsProductView);
export const createProductClickVprEvent = createTrackingEvent(vprProductClick);
export const createProductClickVpsEvent = createTrackingEvent(vpsProductClick);
