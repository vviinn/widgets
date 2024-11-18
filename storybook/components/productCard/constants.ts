const commonParams = {
  locale: "en-US",
  deeplink: "#",
  currency: "€",
  style: { width: "240px" },
  "image-width": "240",
};

export const productDataByIndustryAndType = {
  fashion: {
    mainCard: {
      id: "4130004-1",
      "product-title": "Magic Energy 100 ml Damen",
      brand: "Charlotte Tilbury ",
      "product-type": "Eau de Parfum",
      price: "150.00",
      "base-price": '{"price":1500.00,"quantity":1,"measure":"l"}',
      "sale-price": "149.99",
      "base-sale-price": '{"price":1499.00,"quantity":1,"measure":"l"}',
      image:
        "https://www.fashionhype.com/uploads/tx_amproductfeeds/produktbilder/4130004.jpg",
    },
    appendCard: {
      id: "4012501-1",
      "product-title": "Mtb 03 In-ear-kopfhörer Grün",
      brand: "Montblanc",
      price: "390.0",
      "sale-price": "389.99",
      image:
        "https://www.fashionhype.com/uploads/tx_amproductfeeds/produktbilder/4012501.jpg",
      "energy-certifications-string":
        '[{"certificationClass":"A++","classIconUrls":{"left":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/left/A++.svg","right":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/right/A++.svg"},"classRange":{"min":"A++","max":"D"},"classLabelUrl":"https://energy-efficient-products.ec.europa.eu/sites/default/files/styles/embed_medium_2x/public/2024-04/sample-energy-label-with-numbers-new.png?itok=x7puJdbG","classDataSheetUrl":"https://www.roller.de/medias/sys_master/datasheets/datasheets/h7a/hc5/11687118700574/1328023300-P01.pdf","productType":"Tischleuchte"}]',
    },
    setCard: {
      id: "3918542-1",
      "product-title": "Cargojeans blau beige",
      brand: "Mrs & HUGS",
      price: "129.99",
      image:
        "https://www.fashionhype.com/uploads/tx_amproductfeeds/produktbilder/3918542.jpg",
    },
    minimalisticCard: {
      id: "4120256-1",
      "product-title": "4er-Pack Socken weiss beige",
      brand: "Calvin Klein",
      "product-type": "Socken",
      price: "29.9",
      "sale-price": "25",
      image:
        "https://www.fashionhype.com/uploads/tx_amproductfeeds/produktbilder/4120256.jpg",
    },
  },
  "home-living": {
    mainCard: {
      id: "301403586523",
      "product-title": "Windlicht-Set",
      brand: "MARILU",
      "product-type": "Accessoires > Gedeckter Tisch > Kerzen & Leuchter",
      price: "8.9",
      "base-price": '{"price":2.23,"quantity":1,"measure":"Stk"}',
      "sale-price": "8",
      "base-sale-price": '{"price":2,"quantity":1,"measure":"Stk"}',
      image:
        "https://cdn.vviinn.com/image/0/fit/400/0/ce/0/Z3M6Ly92dmlpbm4tY2F0YWxvZy1pbWFnZXMtcHJvZHVjdGlvbi9tZWRpYS50cmVuZHMuZGUvMmFqbF94UkszalEtTDJKcGJHUXlMekEwTnpNNE16Z3VhbkJuLmpwZw==",
    },
    appendCard: {
      id: "296104578150",
      "product-title": "Stehleuchte LEITUNG",
      brand: "FISCHER & HONSEL",
      price: "199.0",
      "sale-price": "165.3",
      "add-to-basket-show": "true",
      image:
        "https://cdn.vviinn.com/image/0/fit/400/0/ce/0/Z3M6Ly92dmlpbm4tY2F0YWxvZy1pbWFnZXMtcHJvZHVjdGlvbi9tZWRpYS5vc3Rlcm1hbm4uZGUveDAtTk5feE1wcG8tTDJKcGJHUXhMekExTnpFMU1UTXVhbkJuLmpwZw==",
      "energy-certifications-string":
        '[{"certificationClass":"A","classIconUrls":{"left":"https://cdn.vviinn.com/assets/certification/energy/AtoG/left/A.svg","right":"https://cdn.vviinn.com/assets/certification/energy/AtoG/right/A.svg"},"classRange":{"min":"A","max":"G"},"classLabelUrl":"https://energy-efficient-products.ec.europa.eu/sites/default/files/styles/embed_medium_2x/public/2024-04/sample-energy-label-with-numbers-new.png?itok=x7puJdbG","classDataSheetUrl":"https://www.roller.de/medias/sys_master/datasheets/datasheets/h7a/hc5/11687118700574/1328023300-P01.pdf","productType":"Tischleuchte"}]',
    },
    setCard: {
      idL: "266152528616",
      "product-title": "Sessel",
      brand: "VERO",
      price: "149.0",
      image: "https://media.trends.de/bild1/0440803-00004.jpg",
    },
    minimalisticCard: {
      id: "286429561802",
      "product-title": "Sideboard",
      brand: "ELTON",
      "product-type": "Möbel > Schränke & Regale > Sideboards",
      price: "599.0",
      "sale-price": "550.0",
      image: "https://media.ostermann.de/bild1/0476790.jpg",
    },
  },
};

export const cardDataByType = {
  mainCard: {
    uniqueId: "main",
    header: "Full Content View with One-click Discovery modal",
    productData: {
      "price-prefix": "",
      "custom-labels": "UVP",
      "add-to-basket-show": "true",
      "favorite-show": "true",
      ...commonParams,
    },
    style: `
<style>
    vviinn-product-card::part(custom-label-0) {
        display: block;
    }
</style>`,
    buttonParams: {},
  },
  appendCard: {
    uniqueId: "append",
    header: "Partial Content View with appended One-click Discovery",
    productData: {
      "add-to-basket-show": "true",
      "is-standalone": "true",
      ...commonParams,
    },
    buttonParams: { append: true },
  },
  setCard: {
    uniqueId: "set",
    header: "Partial Content Set Mode View",
    productData: {
      "set-mode": "true",
      "add-to-basket-show": "true",
      "is-standalone": "true",
      ...commonParams,
    },
  },
  minimalisticCard: {
    uniqueId: "minimalistic",
    header: "Minimalistic View (with hidden content)",
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
    header: "Product Card: Styling Custom Label and Changing Order",
    info: "Custom labels are hidden by default, so we should rewrite the display property to show them. The code example also demonstrates how to change the order of the elements. In this case, we should set an 'order' property for each displayed part of the Product Card.",
    productData: {
      "product-title": "Couchtisch Rolf Benz 8770 Ronald Schmitt",
      price: "3629",
      "sale-price": "1653",
      image:
        "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
      "is-standalone": "true",
      "custom-labels": "UVP, SALE",
      ...commonParams,
    },
    style: `
<style>
  vviinn-product-card::part(title) {
    order: 1;
  }

   vviinn-product-card::part(custom-label-0) {
    order: 2;
    display: block;
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
