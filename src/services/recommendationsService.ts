import { httpGet } from '../utils/requestUtils';
import { FetchOptions } from '../interfaces/fetch-options';

export const getRecommendations = (productId: string) => (options: FetchOptions) =>  {
  const recommendationsUrl = `${process.env.RECOMMENDATIONS_URL}${productId}/similar-products`;
  return httpGet(recommendationsUrl, options);
}
