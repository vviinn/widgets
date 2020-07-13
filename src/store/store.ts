import { createStore } from "@stencil/store";

const { state } = createStore({
  fallbackStyles: '',
  pricePrefix: null,
  currencySign: null
});

export default state;
