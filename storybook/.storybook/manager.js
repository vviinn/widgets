import { addons } from "storybook/manager-api";
import vviinnTheme from "./vviinn-theme";
import demoSites from "../helpers/demoSites.json";
import { SITE_STORAGE_KEY, vviinnSite } from "../helpers/siteSelection";
import "./addons/close-modals-addon";

addons.setConfig({
  theme: vviinnTheme,
  enableShortcuts: false,
  sidebar: {
    showRoots: true,
  },
});

const appendSiteSelect = () => {
  const explorerMenu = document.getElementById("storybook-explorer-menu");

  const createSelect = () => {
    const selectList = document.createElement("select");
    selectList.onchange = (e) => {
      const target = e.target;
      localStorage.setItem(SITE_STORAGE_KEY, target.value);
      location.reload();
    };
    selectList.id = "vviinn-site-select";

    Object.entries(demoSites).forEach(([value, { label }]) => {
      const option = document.createElement("option");
      option.value = value;
      option.text = label;
      if (vviinnSite === value) {
        option.selected = true;
      }
      selectList.appendChild(option);
    });

    return selectList;
  };

  const appendToMenu = (menu) => {
    if (menu && !menu.querySelector("#vviinn-site-select")) {
      const selectList = createSelect();
      menu.prepend(selectList);
    }
  };

  appendToMenu(explorerMenu);
};

const observeMenuChanges = () => {
  const observer = new MutationObserver(() => {
    appendSiteSelect();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

document.addEventListener("DOMContentLoaded", () => {
  appendSiteSelect();
  observeMenuChanges();
});
