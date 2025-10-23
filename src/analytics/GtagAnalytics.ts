import { ProductAnalytics } from "./ProductAnalytics";
import { Recommendation } from "../interfaces";

export class GtagAnalytics implements ProductAnalytics {
  sendImpression(product: Recommendation) {
    if (!product) return;
    gtag("event", "view_item_list", {
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: product.brand ?? "",
          category: product.productType ?? "",
          list_name: "VI VPR View",
          price: Math.min(
            ...[product.price.actual, product.price.sale ?? Infinity],
          ),
        },
      ],
    });

    return undefined;
  }

  sendClick(product: Recommendation) {
    if (!product) return;

    gtag("event", "select_content", {
      content_type: "product",
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: product.brand ?? "",
          category: product.productType ?? "",
          list_name: "VI VPR View",
          price: Math.min(
            ...[product.price.actual, product.price.sale ?? Infinity],
          ),
        },
      ],
    });

    return undefined;
  }
}
