const productImageBase =
  "https://cdn.vviinn.com/assets/merchant/default/product-card/";

export const productImages = {
  perfume: `${productImageBase}fashion-01-perfume.jpg`,
  earring: `${productImageBase}fashion-02-earring.jpg`,
  cargoPants: `${productImageBase}fashion-03-cargo-pants.jpg`,
  socks: `${productImageBase}fashion-04-socks.jpg`,
  lanternSet: `${productImageBase}home-01-lantern-set.jpg`,
  pendantLamp: `${productImageBase}home-02-pendant-lamp.jpg`,
  armchair: `${productImageBase}home-03-armchair.jpg`,
  sideboard: `${productImageBase}home-04-sideboard.jpg`,
  diningChair: `${productImageBase}home-05-dining-chair.jpg`,
};

const commonParams = {
  locale: "en-US",
  deeplink: "#",
  currencySign: "€",
  style: { width: "fit-content" },
  "image-width": "300",
  "image-resolution-width": "500",
};

export const productDataByIndustryAndType = {
  fashion: {
    mainCard: {
      id: "1001",
      "product-title": "Magic Energy 100 ml Damen",
      brand: "Charlotte Tilbury ",
      "product-type": "Eau de Parfum",
      price: "150.00",
      "base-price": '{"price":1500.00,"quantity":1,"measure":"l"}',
      "sale-price": "149.99",
      "base-sale-price": '{"price":1499.00,"quantity":1,"measure":"l"}',
      image: productImages.perfume,
    },
    appendCard: {
      id: "1002",
      "product-title": "CREOLE FÜR ANHÄNGER ROSÉGOLD orange Damen",
      brand: "DoDo",
      price: "70.0",
      "sale-price": "59.99",
      image: productImages.earring,
      "energy-certifications-string":
        '[{"certificationClass":"A++","classIconUrls":{"left":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/left/A++.svg","right":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/right/A++.svg"},"classRange":{"min":"A++","max":"D"},"classLabelUrl":"https://energy-efficient-products.ec.europa.eu/sites/default/files/styles/embed_medium_2x/public/2024-04/sample-energy-label-with-numbers-new.png?itok=x7puJdbG","classDataSheetUrl":"https://example.com/datasheet.pdf","productType":"Tischleuchte"}]',
    },
    setCard: {
      id: "1003",
      "product-title": "Cargo-Pants Beige Damen",
      brand: "Roberto Collina",
      price: "129.99",
      image: productImages.cargoPants,
    },
    minimalisticCard: {
      id: "1004",
      "product-title": "Zweier-Pack kurze Socken aus Baumwoll-Mix Damen",
      brand: "HUGO BOSS",
      "product-type": "Socken",
      price: "29.9",
      "sale-price": "25",
      image: productImages.socks,
    },
  },
  "home-living": {
    mainCard: {
      id: "2001",
      "product-title": "Windlicht-Set",
      brand: "MARILU",
      "product-type": "Accessoires > Gedeckter Tisch > Kerzen & Leuchter",
      price: "8.9",
      "base-price": '{"price":2.23,"quantity":1,"measure":"Stk"}',
      "sale-price": "8",
      "base-sale-price": '{"price":2,"quantity":1,"measure":"Stk"}',
      image: productImages.lanternSet,
    },
    appendCard: {
      id: "2002",
      "product-title": "Hängeleuchte GAETANO 1 (DH 38x150 cm)",
      brand: "EGLO",
      price: "99.0",
      "sale-price": "89.99",
      "add-to-basket-show": "true",
      image: productImages.pendantLamp,
      "energy-certifications-string":
        '[{"certificationClass":"A","classIconUrls":{"left":"https://cdn.vviinn.com/assets/certification/energy/AtoG/left/A.svg","right":"https://cdn.vviinn.com/assets/certification/energy/AtoG/right/A.svg"},"classRange":{"min":"A","max":"G"},"classLabelUrl":"https://energy-efficient-products.ec.europa.eu/sites/default/files/styles/embed_medium_2x/public/2024-04/sample-energy-label-with-numbers-new.png?itok=x7puJdbG","classDataSheetUrl":"https://example.com/datasheet.pdf","productType":"Tischleuchte"}]',
    },
    setCard: {
      id: "2003",
      "product-title": "Sessel Buddy",
      brand: "VITO",
      price: "149.0",
      image: productImages.armchair,
    },
    minimalisticCard: {
      id: "2004",
      "product-title": "Sideboard",
      brand: "ELTON",
      "product-type": "Möbel > Schränke & Regale > Sideboards",
      price: "599.0",
      "sale-price": "550.0",
      image: productImages.sideboard,
    },
  },
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
      image: productImages.diningChair,
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
