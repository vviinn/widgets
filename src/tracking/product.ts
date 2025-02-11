import {
  PRODUCT_VIEW_EVENT_TYPE,
  PRODUCT_CLICK_EVENT_TYPE,
  PRODUCT_LOAD_EVENT_TYPE,
  ADD_TO_BASKET_EVENT_TYPE,
  ADD_TO_WISHLIST_EVENT_TYPE,
  WidgetEventType,
} from "./models";

const vprProductLoad: WidgetEventType = {
  widget: "VPR",
  typ: PRODUCT_LOAD_EVENT_TYPE,
};

const vpcProductLoad: WidgetEventType = {
  widget: "VPC",
  typ: PRODUCT_LOAD_EVENT_TYPE,
};

const vpsProductLoad: WidgetEventType = {
  widget: "VPS",
  typ: PRODUCT_LOAD_EVENT_TYPE,
};

const vprProductView: WidgetEventType = {
  widget: "VPR",
  typ: PRODUCT_VIEW_EVENT_TYPE,
};

const vpcProductView: WidgetEventType = {
  widget: "VPC",
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

const vpcProductClick: WidgetEventType = {
  widget: "VPC",
  typ: PRODUCT_CLICK_EVENT_TYPE,
};

const vpsProductClick: WidgetEventType = {
  widget: "VPS",
  typ: PRODUCT_CLICK_EVENT_TYPE,
};

const vpsAddToBasket: WidgetEventType = {
  widget: "VPS",
  typ: ADD_TO_BASKET_EVENT_TYPE,
};

const tpsAddToBasket: WidgetEventType = {
  widget: "TPS",
  typ: ADD_TO_BASKET_EVENT_TYPE,
};

const vprAddToBasket: WidgetEventType = {
  widget: "VPR",
  typ: ADD_TO_BASKET_EVENT_TYPE,
};

const vpcAddToBasket: WidgetEventType = {
  widget: "VPC",
  typ: ADD_TO_BASKET_EVENT_TYPE,
};

const vpsAddToWishlist: WidgetEventType = {
  widget: "VPS",
  typ: ADD_TO_WISHLIST_EVENT_TYPE,
};

const tpsAddToWishlist: WidgetEventType = {
  widget: "TPS",
  typ: ADD_TO_WISHLIST_EVENT_TYPE,
};

const vprAddToWishlist: WidgetEventType = {
  widget: "VPR",
  typ: ADD_TO_WISHLIST_EVENT_TYPE,
};

const vpcAddToWishlist: WidgetEventType = {
  widget: "VPC",
  typ: ADD_TO_WISHLIST_EVENT_TYPE,
};

export {
  vprProductLoad,
  vprProductView,
  vprProductClick,
  vprAddToBasket,
  vprAddToWishlist,
  vpcProductLoad,
  vpcProductView,
  vpcProductClick,
  vpcAddToBasket,
  vpcAddToWishlist,
  vpsProductClick,
  vpsProductView,
  vpsProductLoad,
  vpsAddToBasket,
  vpsAddToWishlist,
  tpsAddToBasket,
  tpsAddToWishlist,
};
