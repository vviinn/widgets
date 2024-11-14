const commonParams = {
  locale: "en-US",
  deeplink: "#",
  currency: "€",
  style: { width: "240px" },
  "image-width": "240",
};

export const mainCard = {
  uniqueId: "main",
  header: "Full Content View with One-click Discovery modal",
  productData: {
    "product-title": "Papier-Fototapete - bunt - 184x254 cm",
    brand: "HAPPINESS",
    "product-type": "Fototapete",
    price: "59.96",
    "base-price": '{"price":11.77,"quantity":1,"measure":"m²"}',
    "sale-price": "54.99",
    "base-sale-price": '{"price":10.79,"quantity":1,"measure":"m²"}',
    "price-prefix": "",
    "custom-labels": "UVP",
    image:
      "https://images.roller.de/product/papier-fototapete-happiness-bunt-184x254-cm/2566049700?ts=1696944156000&format=webp&size=1170x0",
    "add-to-basket-show": "true",
    ...commonParams,
  },
  style: `
<style>
    vviinn-product-card::part(custom-label-0) {
        display: block;
    }
</style>`,
  buttonParams: {},
};

export const appendCard = {
  uniqueId: "append",
  header: "Partial Content View with appended One-click Discovery",
  productData: {
    "product-title": "Tischleuchte SWINNI",
    brand: "GLOBO Lighting",
    price: "3629",
    "sale-price": "1653",
    image: "https://media.ostermann.de/bild1/0446911.jpg",
    "add-to-basket-show": "true",
    "is-standalone": "true",
    "energy-certifications-string":
      '[{"certificationClass":"A++","classIconUrls":{"left":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/left/A++.svg","right":"https://cdn.vviinn.com/assets/certification/energy/A+++toD/right/A++.svg"},"classRange":{"min":"A++","max":"D"},"classLabelUrl":"https://energy-efficient-products.ec.europa.eu/sites/default/files/styles/embed_medium_2x/public/2024-04/sample-energy-label-with-numbers-new.png?itok=x7puJdbG","classDataSheetUrl":"https://www.roller.de/medias/sys_master/datasheets/datasheets/h7a/hc5/11687118700574/1328023300-P01.pdf","productType":"Tischleuchte"}]',
    ...commonParams,
  },
  buttonParams: { append: true },
};

export const setCard = {
  uniqueId: "set",
  header: "Partial Content Set Mode View",
  productData: {
    "set-mode": "true",
    "product-title": "Isabel Bernard Crossbody Bags",
    brand: "Isabel Bernard",
    price: "183.0",
    image:
      "https://www.fashionhype.com/uploads/tx_amproductfeeds/produktbilder/4176647.jpg",
    "add-to-basket-show": "true",
    "is-standalone": "true",
    ...commonParams,
  },
};

export const minimalisticCard = {
  uniqueId: "minimalistic",
  header: "Minimalistic View (with hidden content)",
  productData: {
    "product-title": "Couchtisch Rolf Benz 8770 Ronald Schmitt",
    brand: "Ronald Schmitt",
    "product-type": "Couchtische",
    price: "3629",
    "sale-price": "1653",
    image:
      "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
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
};

export const customizedLabelCard = {
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
};
