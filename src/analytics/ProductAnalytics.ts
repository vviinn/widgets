import { Recommendation } from "../interfaces";

export interface ProductAnalytics {
  sendImpression: (product: Recommendation) => void;
  sendClick: (product: Recommendation) => void;
}
