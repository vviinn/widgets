import { httpGet } from '../utils/requestUtils';
import { FetchOptions } from '../interfaces/fetch-options';

export const getRecommendations = (options: FetchOptions) =>  httpGet(process.env.RECOMMENDATIONS_URL, options);
