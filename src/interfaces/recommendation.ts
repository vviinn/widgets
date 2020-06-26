import { components } from './generated';

export interface Recommendation {
  product_id: string,
  title: string,
  url: string
}

export interface Interfaces {
  VisualProductSearch: components['schemas']['visual-product-search'],
  VisualProductRecommendations: components['schemas']['visual-product-recommendations']
}
