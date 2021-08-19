import { createStore } from "@stencil/store";

const store = createStore({
  fallbackStyles: "",
  pricePrefix: null,
  currencySign: null,
  apiPath: undefined,
  locale: "de-DE",
});

export default store.state;

export const dispose = store.dispose;
export const state = store.state;
