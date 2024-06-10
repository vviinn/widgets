import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";

export class GtagAnalytics implements ProductAnalytics {
  sendImpression(product: Interfaces["VisualProductSearch"]) {
    if (!product) return undefined;
    gtag("event", "view_item_list", {
      items: [
        {
          id: product.productId,
          name: product.title,
          brand: product.brand ?? "",
          category: product.productType ?? "",
          list_name: "VI VPR View",
          price: Math.min(
            ...[product.price.actual, product.price.sale ?? Infinity]
          ),
        },
      ],
    });

    return undefined;
  }

  sendClick(product: Interfaces["VisualProductSearch"]) {
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
            ...[product.price.actual, product.price.sale ?? Infinity]
          ),
        },
      ],
    });

    return undefined;
  }
}
