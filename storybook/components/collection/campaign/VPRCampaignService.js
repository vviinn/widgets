import { apiGet } from "../network/apiClient";
export const getVPRRecommendations = (productId) => (options) => {
  const url = `product/${productId}/similar-products`;
  return apiGet(url, options);
};
