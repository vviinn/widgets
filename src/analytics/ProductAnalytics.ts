import { Recommendation } from "../interfaces";

export interface ProductAnalytics {
  sendImpression: (product: Recommendation) => undefined;
  sendClick: (product: Recommendation) => undefined;
}
