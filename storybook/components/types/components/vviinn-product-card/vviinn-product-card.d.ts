import { EventEmitter } from "../../stencil-public-runtime";
/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part title - product title
 */
export declare class VviinnProductCard {
  el: HTMLElement;
  brand: string | undefined;
  currency: string | undefined;
  deeplink: string | undefined;
  image: string | undefined;
  imageRatio: number;
  imageWidth: number;
  locale: string | undefined;
  price: number | undefined;
  pricePrefix: string | undefined;
  productId: string;
  productTitle: string;
  productType: string | undefined;
  salePrice: number | undefined;
  responsive: boolean;
  imageLoaded: boolean;
  /** Event fires ones when recommendation rendered on page */
  recommendationLoad: EventEmitter<string>;
  /** Event fires ones when recommendation appears on the viewport */
  recommendationView: EventEmitter<string>;
  /** Event fires ones when user click on deeplink */
  recommendationClick: EventEmitter<string>;
  private intersectionObserver;
  private intersectionCallback;
  componentDidLoad(): void;
  private getProduct;
  private renderImage;
  render(): any;
}
