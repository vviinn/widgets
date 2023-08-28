import { ProductEventType } from "../recommendation/events";
import { createTrackingEvent } from "./event";
import { filterEvent } from "./filter";
import {
  vprProductLoad,
  vpcProductLoad,
  vprProductClick,
  vpcProductClick,
  vprProductView,
  vpcProductView,
  vpsProductClick,
  vpsProductView,
  vpsProductLoad,
} from "./product";
import { searchEvent } from "./search";
import { vpcWidget, vprWidget, vpsWidget } from "./widget";

const createProductLoadVprEvent = createTrackingEvent(vprProductLoad);
const createProductViewVprEvent = createTrackingEvent(vprProductView);
const createProductClickVprEvent = createTrackingEvent(vprProductClick);

const createProductLoadVpcEvent = createTrackingEvent(vpcProductLoad);
const createProductViewVpcEvent = createTrackingEvent(vpcProductView);
const createProductClickVpcEvent = createTrackingEvent(vpcProductClick);

const createProductLoadVpsEvent = createTrackingEvent(vpsProductLoad);
const createProductViewVpsEvent = createTrackingEvent(vpsProductView);
const createProductClickVpsEvent = createTrackingEvent(vpsProductClick);

export const createProductVprEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createProductLoadVprEvent;
    case "view":
      return createProductViewVprEvent;
    case "click":
      return createProductClickVprEvent;
  }
};

export const createProductVpcEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createProductLoadVpcEvent;
    case "view":
      return createProductViewVpcEvent;
    case "click":
      return createProductClickVpcEvent;
  }
};

export const createProductVpsEventByType = (type: ProductEventType) => {
  switch (type) {
    case "load":
      return createProductLoadVpsEvent;
    case "view":
      return createProductViewVpsEvent;
    case "click":
      return createProductClickVpsEvent;
  }
};

export const createWidgetVprEvent = createTrackingEvent(vprWidget);
export const createWidgetVpsEvent = createTrackingEvent(vpsWidget);
export const createWidgetVpcEvent = createTrackingEvent(vpcWidget);

export const createSearchEvent = createTrackingEvent(searchEvent);
export const createFilterEvent = createTrackingEvent(filterEvent);
