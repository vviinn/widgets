import { addons } from "storybook/manager-api";
import vviinnTheme from "./vviinn-theme";
import { vviinnIndustry } from "../helpers";
import "./addons/close-modals-addon";

addons.setConfig({
  theme: vviinnTheme,
  enableShortcuts: false,
  sidebar: {
    showRoots: true,
  },
});

const appendIndustrySelect = () => {
  const explorerMenu = document.getElementById("storybook-explorer-menu");

  const createSelect = () => {
    const array = [
      { value: "home-living", text: "Home & Living" },
      { value: "fashion", text: "Fashion & Accessories" },
      /*{ value: "manufacturer-spare-parts", text: "Manufacturer & Spare Parts" },*/
    ];

    const selectList = document.createElement("select");
    selectList.onchange = (e) => {
      const target = e.target;
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
