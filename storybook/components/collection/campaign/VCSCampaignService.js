import { apiGet } from "../network/apiClient";
export const getVCSRecommendations = (productId) => (options) => {
  const url = `product/${productId}/cross-selling-products`;
  return apiGet(url, options);
};
