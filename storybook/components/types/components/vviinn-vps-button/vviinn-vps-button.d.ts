import { EventEmitter } from "../../stencil-public-runtime";
/**
 * @slot vviinn-onboarding-card-1-icon
 * @slot vviinn-onboarding-card-1-text
 * @slot vviinn-onboarding-card-2-icon
 * @slot vviinn-onboarding-card-2-text
 * @slot vviinn-onboarding-card-3-icon
 * @slot vviinn-onboarding-card-3-text
 * @slot vviinn-example-images-1
 * @slot vviinn-example-images-2
 * @slot vviinn-example-images-3
 * @slot vviinn-example-images-4
 *
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
export declare class VviinnVpsButton {
  el: HTMLElement;
  /** vviinn customer token */
  token: string;
  /** Currency sign will shown after price */
  currencySign: string;
  /** Locale for currency formatting */
  locale: string;
  /** @internal */
  apiPath: string | undefined;
  pressed: boolean;
  /** @internal */
  globalSlotsChanged: EventEmitter<any>;
  handleModalClosed(): void;
  componentDidLoad(): void;
  private handleKeyDown;
  private handleClick;
  render(): any;
}
