import { createStore } from "@stencil/store";

const { state, onChange } = createStore({
  fallbackStyles: ''
});

onChange('fallbackStyles', value => {
  state.fallbackStyles = value;
});

export default state;
