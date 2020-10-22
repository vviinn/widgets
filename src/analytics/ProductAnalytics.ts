import { Interfaces } from "../interfaces/recommendation";

export interface ProductAnalytics {
  sendImpression: (product: Interfaces['VisualProductSearch']) => undefined,
  sendClick: (product: Interfaces['VisualProductSearch']) => undefined,
}
