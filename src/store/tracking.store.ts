import { createStore } from "@stencil/store";
import { onChange as onGlobalStoreChange } from "./store";

export const { state } = createStore({
  enabled: true,
});

onGlobalStoreChange("apiPath", (val) => {
  console.log("kek", val);
});
