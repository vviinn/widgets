import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";

export class GtagAnalytics implements ProductAnalytics {
  send(product: Interfaces['VisualProductSearch']) {
    gtag('event', 'view_item_list', {
        items: [
          {
            id: product.productId,
            name: product.title,
            brand: product.brand ?? '',
            category: product.productType ?? '',
            list_name: 'VI Recommendations',
            price: Math.min(...[product.price.actual, product.price.sale ?? Infinity])
          }
        ]
    });

    return undefined;
  }
}
