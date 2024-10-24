import { energyCertificationsString } from "../../documentation/components/constants";

export const mainCard = {
  uniqueId: "main",
  header: "Full Content View with One-click Discovery modal",
  productData: {
    "product-title": "Couchtisch Rolf Benz 8770 Ronald Schmitt",
    brand: "Ronald Schmitt",
    "product-type": "Couchtische",
    locale: "en-US",
    price: "3629",
    "base-price": '{"price":10,"quantity":1,"measure":"cm²"}',
    "sale-price": "1653",
    "base-sale-price": '{"price":5,"quantity":1,"measure":"cm²"}',
    "price-prefix": "",
    "custom-labels": "UVP",
    image:
      "https://www.moebel-shop.de/media/image/e3/e9/28/0749295-001_600x600.jpg",
    deeplink: "#",
    "image-width": "240",
    "add-to-basket-show": "true",
    currency: "€",
    style: { width: "240px" },
    "energy-certifications-string": energyCertificationsString,
  },
  style: `
<style>
    vviinn-product-card::part(custom-label) {
    display: block;
}
</style>    
    `,
};
