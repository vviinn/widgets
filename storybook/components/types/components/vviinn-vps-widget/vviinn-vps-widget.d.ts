/**
 * @prop --color-primary: color used for action button, slider bullets and selected detected object;
 *
 * @part close-button - close button on modal header.
 * @part secondary-action - back button on modal header.
 * @part title - modal window title.
 *
 * @part select-image_button
 *
 * @part product-card - product card.
 * @part product-card_brand - product card brand.
 * @part product-card_currency - currency sign. Renders after price-amount inside product card.
 * @part product-card_deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part product-card_image - product image inside product card.
 * @part product-card_image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part product-card_price-amount - numeric part of price inside product card.
 * @part product-card_price-container - block contains all prices inside product card.
 * @part product-card_price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part product-card_price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part product-card_price-regular - renders inside price-container when "sale-price" property is empty.
 * @part product-card_price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part product-card_title - product title
 */
export declare class VviinnVpsWidget {
  el: HTMLElement;
  /** vviinn customer token */
  token: string | undefined;
  /** @internal */
  apiPath: string | undefined;
  /** When true modal window with widget will be shown */
  active: boolean;
  /** Currency sign will shown after price */
  currencySign: string;
  /** Locale for currency formatting */
  locale: string;
  slidePosition: number;
  width: number;
  wrongImageFormat: boolean;
  private overflow;
  activeWatcher(value: boolean): void;
  connectedCallback(): void;
  private handleImageSelection;
  private resetState;
  private haveErrors;
  private resetScroll;
  private handleModalClose;
  render(): any;
}
