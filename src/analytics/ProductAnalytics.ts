import { Recommendation } from "../interfaces/recommendation";

export interface ProductAnalytics {
  sendImpression: (product: Recommendation) => undefined;
  sendClick: (product: Recommendation) => undefined;
}
