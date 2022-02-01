import { ProductAnalytics } from "./ProductAnalytics";
import { Interfaces } from "../interfaces/recommendation";
export declare class GtagAnalytics implements ProductAnalytics {
  sendImpression(product: Interfaces['VisualProductSearch']): any;
  sendClick(product: Interfaces['VisualProductSearch']): any;
}
