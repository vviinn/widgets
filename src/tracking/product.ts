import {
  PRODUCT_VIEW_EVENT_TYPE,
  PRODUCT_CLICK_EVENT_TYPE,
  WidgetEventType,
} from "./models";

const vprProductView: WidgetEventType = {
  widget: "VPR",
  typ: PRODUCT_VIEW_EVENT_TYPE,
};

const vpsProductView: WidgetEventType = {
  widget: "VPS",
  typ: PRODUCT_VIEW_EVENT_TYPE,
};

const vprProductClick: WidgetEventType = {
  widget: "VPR",
  typ: PRODUCT_CLICK_EVENT_TYPE,
};

const vpsProductClick: WidgetEventType = {
  widget: "VPS",
  typ: PRODUCT_CLICK_EVENT_TYPE,
};

export { vprProductClick, vprProductView, vpsProductClick, vpsProductView };
