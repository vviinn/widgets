import { addons } from "@storybook/manager-api";
import vviinnTheme from "./vviinn-theme";
import { vviinnIndustry } from "../helpers";

addons.setConfig({
  theme: vviinnTheme,
  enableShortcuts: false,
  sidebar: {
    showRoots: true,
  },
});

window.addEventListener("load", () => {
  setTimeout(() => {
    const storybookExplorerMenu = document.getElementById(
      "storybook-explorer-menu"
    );

    if (storybookExplorerMenu) {
      const array = [
        { value: "home-living", text: "Home & Living" },
        { value: "fashion", text: "Fashion & Accessories" },
        /*{ value: "manufacturer-spare-parts", text: "Manufacturer & Spare Parts" },*/
      ];

      const selectList = document.createElement("select");
      selectList.onchange = (e) => {
        localStorage.setItem("vviinn-industries", e.target.value);
        location.reload();
      };
      selectList.id = "vviinn-industries";
      storybookExplorerMenu.appendChild(selectList);

      for (let i = 0; i < array.length; i++) {
        const option = document.createElement("option");
        const { value, text } = array[i];
        option.value = value;
        option.text = text;
        if (vviinnIndustry === value) {
          option.selected = "selected";
        }
        selectList.appendChild(option);
      }

      storybookExplorerMenu.prepend(selectList);
    }
  }, 100);
});
