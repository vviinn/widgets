import { Recommendation } from "../recommendation/recommendation";
export interface ProductAnalytics {
  sendImpression: (product: Recommendation) => undefined;
  sendClick: (product: Recommendation) => undefined;
}
