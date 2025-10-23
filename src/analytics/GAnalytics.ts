import { ProductAnalytics } from "./ProductAnalytics";
import { Recommendation } from "../interfaces";

export class GAnalytics implements ProductAnalytics {
  constructor() {
    ga("require", "ec");
  }

  convertProduct(product: Recommendation) {
    return {
      id: product.productId,
      name: product.title,
      brand: product.brand ?? "",
      category: product.productType ?? "",
      list: "VI VPR View",
      price: Math.min(
        ...[product.price.actual, product.price.sale ?? Infinity],
      ),
    };
  }

  sendImpression(product: Recommendation) {
    if (!product) return;

    ga("ec:addImpression", this.convertProduct(product));

    return undefined;
  }

  sendClick(product: Recommendation) {
    if (!product) return;

    ga("ec:addProduct", {
      id: product.productId,
      name: product.title,
      brand: product.brand ?? "",
      category: product.productType ?? "",
      price: Math.min(
        ...[product.price.actual, product.price.sale ?? Infinity],
      ),
    });

    ga("ec:setAction", "click", { list: "VI VPR View" });

    return undefined;
  }
}
