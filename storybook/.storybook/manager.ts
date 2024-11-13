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

const appendIndustrySelect = () => {
  const explorerMenu = document.getElementById("storybook-explorer-menu");

  // Helper function to create the select element
  const createSelect = () => {
    const array = [
      { value: "home-living", text: "Home & Living" },
      { value: "fashion", text: "Fashion & Accessories" },
      /*{ value: "manufacturer-spare-parts", text: "Manufacturer & Spare Parts" },*/
    ];

    const selectList = document.createElement("select");
    selectList.onchange = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      localStorage.setItem("vviinn-industries", target.value);
      location.reload();
    };
    selectList.id = "vviinn-industries";

    array.forEach(({ value, text }) => {
      const option = document.createElement("option");
      option.value = value;
      option.text = text;
      if (vviinnIndustry === value) {
        option.selected = true;
      }
      selectList.appendChild(option);
    });

    return selectList;
  };

  // Append the selector to the given container if it doesn't already exist
  const appendToMenu = (menu) => {
    if (menu && !menu.querySelector("#vviinn-industries")) {
      const selectList = createSelect();
      menu.prepend(selectList);
    }
  };

  appendToMenu(explorerMenu);
};

const observeMenuChanges = () => {
  const observer = new MutationObserver(() => {
    appendIndustrySelect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

document.addEventListener("DOMContentLoaded", () => {
  appendIndustrySelect();
  observeMenuChanges();
});
