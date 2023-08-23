import { createTrackingEvent } from "./event";
import { filterEvent } from "./filter";
import {
  vprProductLoad,
  vpsProductLoad,
  vpcProductClick,
  vpcProductView,
  vprProductClick,
  vprProductView,
  vpsProductClick,
  vpsProductView,
} from "./product";
import { searchEvent } from "./search";
import { vpcWidget, vprWidget, vpsWidget } from "./widget";

export const createProductLoadVprEvent = createTrackingEvent(vprProductLoad);
export const createProductLoadVpsEvent = createTrackingEvent(vpsProductLoad);
export const createProductViewVprEvent = createTrackingEvent(vprProductView);
export const createProductViewVpsEvent = createTrackingEvent(vpsProductView);
export const createProductViewVpcEvent = createTrackingEvent(vpcProductView);

export const createProductClickVprEvent = createTrackingEvent(vprProductClick);
export const createProductClickVpsEvent = createTrackingEvent(vpsProductClick);
export const createProductClickVpcEvent = createTrackingEvent(vpcProductClick);

export const createWidgetVprEvent = createTrackingEvent(vprWidget);
export const createWidgetVpsEvent = createTrackingEvent(vpsWidget);
export const createWidgetVpcEvent = createTrackingEvent(vpcWidget);

export const createSearchEvent = createTrackingEvent(searchEvent);
export const createFilterEvent = createTrackingEvent(filterEvent);
