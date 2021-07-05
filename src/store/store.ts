import { createStore } from "@stencil/store";

const store = createStore({
  fallbackStyles: "",
  pricePrefix: null,
  currencySign: null,
  apiPath: undefined,
});

export default store.state;

export const dispose = store.dispose;
export const state = store.state;
