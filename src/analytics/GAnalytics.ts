import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";

export class GAnalytics implements ProductAnalytics {
  send(product: Interfaces['VisualProductSearch']) {
    ga('ec:addImpression', {
      id: product.productId,
      name: product.title,
      brand: product.brand ?? '',
      category: product.productType ?? '',
      list: 'VI Recommendations',
      price: Math.min(...[product.price.actual, product.price.sale ?? Infinity])
    });

    return undefined;
  }
}
