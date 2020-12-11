import { httpGet } from '../utils/requestUtils';
import { FetchOptions } from '../interfaces/fetch-options';
import { Interfaces } from '../interfaces/recommendation';

export const getVPRRecommendations = (productId: string) => (options: FetchOptions) =>  {
  const recommendationsUrl = `${process.env.RECOMMENDATIONS_URL}${productId}/similar-products`;
  return httpGet<Interfaces['VisualProductRecommendations']>(recommendationsUrl, options);
}
