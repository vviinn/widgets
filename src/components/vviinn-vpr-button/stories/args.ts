export const argTypes = {
  token: {
    control: {
      type: "text",
    },
    primary: true,
  },
  excluded: {
    name: "excluded",
    control: {
      type: "text",
    },
  },
  sidebarTitle: {
    name: "sidebar-title",
    control: {
      type: "text",
    },
    defaultValue: "Visually similar products",
  },
  modalScrollbar: {
    name: "modal-scrollbar",
    control: {
      type: "boolean",
    },
    defaultValue: false,
  },
  campaigns: {
    name: "campaigns",
    control: {
      type: "text",
    },
  },
  addStyle: {
    name: "add-style",
    control: {
      type: "boolean",
    },
    defaultValue: true,
  },
  imageWidth: {
    name: "image-width",
    control: {
      type: "text",
    },
    defaultValue: "300",
  },
  mode: {
    name: "mode",
    options: ["continuity", "grid", "cross-selling"],
    control: {
      type: "select",
    },
    defaultValue: "continuity",
  },
  sourceImage: {
    name: "source-image",
    defaultValue:
      "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
  },
  color: {
    name: "color",
    control: {
      type: "color",
    },
  },
  productId: {
    name: "product-id",
    control: {
      type: "text",
    },
  },
  currencySign: {
    name: "currency-sign",
    control: {
      type: "text",
    },
  },
};
