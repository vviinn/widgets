import { httpGet } from '../utils/requestUtils';
import { FetchOptions } from '../interfaces/fetch-options';
import { Interfaces } from '../interfaces/recommendation';

export const getVCSRecommendations = (productId: string) => (options: FetchOptions) =>  {
  const recommendationsUrl = `${process.env.RECOMMENDATIONS_URL}${productId}/cross-selling-products`;
  return httpGet<Interfaces['VisualProductRecommendations']>(recommendationsUrl, options);
}
