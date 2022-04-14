import { createStore } from "@stencil/store";

export const { state, onChange } = createStore({
  fallbackStyles: "",
  pricePrefix: null,
  currencySign: null,
  apiPath: undefined,
  locale: "de-DE",
});
