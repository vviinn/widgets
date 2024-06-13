import { ProductAnalytics } from "./ProductAnalytics";
import { SearchInterfaces } from "../interfaces/search";

export class GAnalytics implements ProductAnalytics {
  constructor() {
    ga("require", "ec");
  }

  convertProduct(product: SearchInterfaces["VisualProductSearch"]) {
    return {
      id: product.productId,
      name: product.title,
      brand: product.brand ?? "",
      category: product.productType ?? "",
      list: "VI VPR View",
      price: Math.min(
        ...[product.price.actual, product.price.sale ?? Infinity]
      ),
    };
  }

  sendImpression(product: SearchInterfaces["VisualProductSearch"]) {
    ga("ec:addImpression", this.convertProduct(product));

    return undefined;
  }

  sendClick(product: SearchInterfaces["VisualProductSearch"]) {
    ga("ec:addProduct", {
      id: product.productId,
      name: product.title,
      brand: product.brand ?? "",
      category: product.productType ?? "",
      price: Math.min(
        ...[product.price.actual, product.price.sale ?? Infinity]
      ),
    });

    ga("ec:setAction", "click", { list: "VI VPR View" });

    return undefined;
  }
}
