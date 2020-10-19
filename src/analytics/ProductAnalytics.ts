import { Interfaces } from "../interfaces/recommendation";

export interface ProductAnalytics {
  send: (product: Interfaces['VisualProductSearch']) => undefined,
}
