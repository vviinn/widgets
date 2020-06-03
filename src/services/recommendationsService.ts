import { httpGet } from '../utils/requestUtils';

export const getRecommendations = httpGet(process.env.RECOMMENDATIONS_URL)
