import { createStore } from "@stencil/store";
import { trackingStore } from "./tracking.store";

export const { state, onChange } = createStore({
  fallbackStyles: "",
  pricePrefix: null,
  currencySign: null,
  apiPath: null,
  token: null,
  locale: "de-DE",
  ...trackingStore,
});
