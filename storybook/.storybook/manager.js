import { addons } from "@storybook/manager-api";
import vviinnTheme from "./vviinn-theme";

addons.setConfig({
  theme: vviinnTheme,
  enableShortcuts: false,
});
