import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";
export declare class GAnalytics implements ProductAnalytics {
  constructor();
  convertProduct(product: Interfaces['VisualProductSearch']): {
    id: string;
    name: string;
    brand: string;
    category: string;
    list: string;
    price: number;
  };
  sendImpression(product: Interfaces['VisualProductSearch']): any;
  sendClick(product: Interfaces['VisualProductSearch']): any;
}
