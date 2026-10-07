const commonParams = {
  locale: "en-US",
  deeplink: "#",
  currencySign: "€",
  style: { width: "fit-content" },
  "image-width": "300",
  "image-resolution-width": "500",
};

export const cardDataByType = {
  mainCard: {
    uniqueId: "main",
    header: "Full Content View with Modal One-Click Discovery",
    productData: {
      "price-prefix": "",
      "custom-labels": "UVP",
      "add-to-basket-show": "true",
      "favorite-show": "true",
      ...commonParams,
    },
    style: `
<style>
    vviinn-product-card::part(custom-label-0 custom-label-content) {
        display: block;
    }
</style>`,
    buttonParams: {},
  },
  appendCard: {
    uniqueId: "append",
    header: "Partial Content View with Appended One-Click Discovery",
    productData: {
      "add-to-basket-show": "true",
      "is-standalone": "true",
      ...commonParams,
    },
    buttonParams: { append: true },
  },
  setCard: {
    uniqueId: "set",
    header: "Partial Content View (Set Mode)",
    productData: {
      "set-mode": "true",
      "add-to-basket-show": "true",
      "is-standalone": "true",
      ...commonParams,
    },
  },
  minimalisticCard: {
    uniqueId: "minimalistic",
    header: "Minimalistic View with Manually Hidden Content",
    productData: {
      "is-standalone": "true",
      ...commonParams,
    },
    style: `
<style>
  vviinn-product-card::part(brand),
  vviinn-product-card::part(product-type),
  vviinn-product-card::part(price-outdated) {
    display: none;
  }
</style>`,
  },
  customizedLabelCard: {
    uniqueId: "customized-label",
    header: "Product Card: Styling Custom Labels and Changing Order",
    productData: {
      id: "3001",
      "product-title": "Polsterstuhl bert plantagie DUO",
      price: "539",
      "sale-price": "440",
      image:
        "https://cdn.vviinn.com/assets/merchant/default/product-card/home-05-dining-chair.jpg",
      "is-standalone": "true",
      "custom-labels": "UVP, SALE",
      ...commonParams,
    },
    style: `
<style>
  /*
    This example targets the standalone <vviinn-product-card> tag.
    In production the card is rendered inside a widget, so use the tag
    of the widget you embed as the host instead — e.g.
    vviinn-vps-widget::part(title), vviinn-vpr-widget::part(custom-label-0), etc.
    The part names are the same.
  */
  vviinn-product-card::part(title) {
    order: 1;
  }

   vviinn-product-card::part(custom-label-0 custom-label-content) {
    display: block;
    order: 2;
  }

   vviinn-product-card::part(custom-label-1 custom-label-image) {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
  }

   vviinn-product-card::part(price-outdated) {
    order: 3;
  }

   vviinn-product-card::part(price-sale) {
    order: 4;
  }
</style>`,
  },
};
