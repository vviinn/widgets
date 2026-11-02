import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  State,
  Watch,
} from "@stencil/core";
import i18next from "i18next";
import { version } from "../../../package.json";
import { SimilarProductsIcon, CrossSellingIcon } from "../vviinn-icons";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { CampaignName } from "../../campaign/Campaign";
import {
  BasicEventData,
  ProductCardEventData,
} from "../../recommendation/events";
import { Locale, initializeLocale } from "../../locale";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
import { OneClickDiscoveryMode } from "../../widget/types";
import { useSearchStore } from "../../store/search.store";
import {
  DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH,
  PRODUCT_CARD_IMAGE_WIDTH,
  SIDEBAR_ANIMATION_DURATION,
} from "../../widget/constants";
import { addEventListenersWithSignal } from "../../dom";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
/**
 * @part button - Clickable button element.
 * @part vviinn-button - Button element container.
 * @part product-card - Product Card itself.
 * @part title - Title inside Product Card.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
 * @part image-placeholder - Placeholder shown when no image is available.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-base-sale - Numeric part of the base price.
 * @part price-amount-base-outdated - Numeric part of the base price.
 * @part price-amount-base-regular - Numeric part of the base price.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part product-card-actions - Product Card actions wrapper.
 * @part product-card-actions-top - Product Card top actions wrapper.
 * @part carousel-button - Both carousel navigation buttons (generic part).
 * @part carousel-button-prev - The previous/back carousel navigation button.
 * @part carousel-button-next - The next/forward carousel navigation button.
 * @part recommendations-results - For internal usage only!
 * @part recommendations-title - Title of the recommendations grid.
 * @part recommendations-subtitle - Subtitle of the recommendations grid.
 * @part basket-button - Add to Basket button.
 * @part favorite-button - Favorite button.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part product-images-pagination - Container for product images pagination dots (mobile only).
 * @part product-images-pagination-bullet - Individual pagination dot.
 * @part product-images-pagination-bullet-active - Active pagination dot.
 * @part update-button-top - Update Button on the top (Set mode).
 * @part update-button-item - Update Button inside the Product Card (Set mode).
 * @part discount-label - Discount label in Product Card (Set mode).
 * @part discount-percentage - Discount percentage inside the Add to Basket button (Set mode).
 * @part list-card - List card container.
 * @part list-card-content-container - List card's content container.
 * @part list-card-image-container - List card's image container.
 * @part list-label - List card's label (e.g., "Category").
 * @part list-title - List card's title.
 *
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 *
 * @slot vviinn-recommendations-title - Recommendations title text.
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 *
 * @slot vviinn-recommendations-subtitle - Recommendations subtitle text, shown in Set mode or when `block-subtitle` is set.
 * @slot vviinn-update-button-text - Text of Update Button on the top (Set mode).
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-image-placeholder-icon - Icon or content for the image placeholder.
 */

@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Element() el: HTMLElement;
  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Locale for number formatting. Falls back to locale */
  @Prop() numberLocale?: string;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** ID of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Switch between carousel modes */
  @Prop() mode: CarouselMode = "continuity";
  /** Comma-separated list of campaign IDs */
  @Prop() campaigns: string = "";
  /** Excluded filter. Example: "brand:Nike,Vans;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = this.mode === "set" ? "VCS" : "VPR";
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Width of each recommended product image in Continuity mode */
  @Prop() imageWidth: number = PRODUCT_CARD_IMAGE_WIDTH;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number =
    DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Show multiple images on hover (desktop only) */
  @Prop() showMultipleImages: boolean = false;
  /** Items amount in set mode grid */
  @Prop() setItemsAmount?: number = 4;
  /** URL to external CSS file for custom styling */
  @Prop() cssUrl: string | null = null;
  /** A custom message is displayed when no results */
  @Prop() noResultText: string = "";
  /** Showing a message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow: boolean = true;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = false;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show filters on top */
  @Prop() showFilters: boolean = false;
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  /** One-Click Discovery mode*/
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryMode = "modal";

  /** List of discounts for Set mode. Example: "5, 10, 15, 20" (could be less than 4 numbers) */
  @Prop() setModeDiscounts: string = this.mode === "set" ? "5, 10, 15" : "";
  /** Location of Update button for Set mode */
  @Prop() updateButtonLocation: UpdateButtonLocation = "topAndItem";

  /** Sidebar title */
  @Prop() sidebarTitle: string;
  /** Widget's subtitle */
  @Prop() sidebarSubtitle: string;
  /** Show or hide the scrollbar */
  @Prop() modalScrollbar: boolean = false;
  /** Position of the modal */
  @Prop() position: "bottom" | "right" = "bottom";
  /** Add default styles to the button */
  @Prop() addStyle: boolean = true;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;

  /** @internal */
  @Prop() appendSidebarToElement: HTMLElement;
  /** ID of an HTML element that you want to attach the sidebar  */
  /** @internal */
  @Prop() appendSidebarToId: string;
  /** @internal */
  @Prop() isStandalone: boolean = true;

  /** @internal */
  @Prop() showInWidget: boolean = false;

  /** @internal */
  @Prop() uiSessionId?: string;

  /** Event emitted on widget load */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Event emitted on modal open */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** Event emitted on modal close */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Click on the product's link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The recommendation appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** The recommendation result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The recommendation result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Recommendation request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Add to Basket button clicked */
  @Event() vviinnAddToBasket: EventEmitter<BasicEventData>;

  /** The VPR button is activated */
  @Event() vviinnVprButtonActivated: EventEmitter<void>;

  @State() targetAppendSidebarTo: HTMLElement;

  private iconSideSize?: number;
  private disposeStoreListener?: () => void;
  private eventAbortController?: AbortController;

  connectedCallback() {
    this.iconSideSize = this.isStandalone ? 24 : 14;
    const { onChange } = useSearchStore(this.showInWidget);
    this.disposeStoreListener = onChange("searchStatus", (searchStatus) => {
      searchStatus === "loading" && this.sidebarCloseListener();
    });
  }

  async componentWillLoad() {
    await initializeLocale(this.locale);

    if (this.appendSidebarToElement) {
      this.targetAppendSidebarTo = this.appendSidebarToElement;
    } else if (this.appendSidebarToId) {
      this.targetAppendSidebarTo = document.getElementById(
        this.appendSidebarToId,
      );
    }
  }

  @Watch("appendSidebarToElement")
  appendSidebarToElementWatcher() {
    if (this.appendSidebarToElement) {
      this.targetAppendSidebarTo = this.appendSidebarToElement;
    }
  }

  private sidebar: HTMLVviinnRecommendationsSidebarElement | null = null;

  private removeSidebarFromDOM = () => {
    if (!this.sidebar) return;

    if (this.targetAppendSidebarTo?.contains(this.sidebar)) {
      this.targetAppendSidebarTo.removeChild(this.sidebar);
    } else if (document.body.contains(this.sidebar)) {
      document.body.removeChild(this.sidebar);
    }
    this.sidebar = null;
  };

  private sidebarCloseListener = (isStorybookClose = false) => {
    if (!this.sidebar) return;

    if (isStorybookClose) {
      this.removeSidebarFromDOM();
    } else {
      (this.sidebar as any).sidebarState = "closed";
      setTimeout(() => this.removeSidebarFromDOM(), SIDEBAR_ANIMATION_DURATION);
    }
  };

  private handleButtonClick = () => {
    this.vviinnVprButtonActivated.emit();
    if (this.appendSidebarToId && !this.targetAppendSidebarTo) {
      setTimeout(() => {
        this.handleClick();
      }, 250);
    } else {
      this.handleClick();
    }
  };

  private getAriaLabel(): string {
    try {
      return i18next.t("a11y.findSimilarProducts") || "Find similar products";
    } catch {
      return "Find similar products";
    }
  }

  render() {
    return (
      <Host
        role="button"
        tabindex="0"
        aria-label={this.getAriaLabel()}
        onClick={this.handleButtonClick}
        onKeyDown={this.handleKeyDown}
      >
        {renderExternalCSS(this.cssUrl)}
        <vviinn-button addStyle={this.addStyle} part="vviinn-button">
          <slot>
            {this.campaignType === "VCS" ? (
              <CrossSellingIcon
                width={this.iconSideSize}
                height={this.iconSideSize}
              />
            ) : (
              <SimilarProductsIcon
                width={this.iconSideSize}
                height={this.iconSideSize}
              />
            )}
          </slot>
        </vviinn-button>
      </Host>
    );
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      this.handleButtonClick();
    }
  };

  private handleClick(): void {
    const sidebar = document.createElement("vviinn-recommendations-sidebar");
    sidebar.token = this.token;
    sidebar.locale = this.locale;
    sidebar.numberLocale = this.numberLocale;
    sidebar.currencySign = this.currencySign;
    sidebar.pricePrefix = this.pricePrefix;
    sidebar.apiPath = this.apiPath;
    sidebar.sidebarTitle = this.sidebarTitle;
    sidebar.sidebarSubtitle = this.sidebarSubtitle;
    sidebar.productId = this.productId;
    sidebar.position = this.position;
    sidebar.widgetScrollbar = this.modalScrollbar;
    sidebar.campaigns = this.campaigns;
    sidebar.campaignType = this.campaignType;
    sidebar.color = this.color;
    sidebar.imageWidth = this.imageWidth;
    sidebar.showMultipleImages = this.showMultipleImages;
    sidebar.imageResolutionWidth = this.imageResolutionWidth;
    sidebar.buttonElementId = this.el.id;
    sidebar.noResultText = this.noResultText;
    sidebar.noResultShow = this.noResultShow;
    sidebar.gridArrowsDynamic = this.gridArrowsDynamic;
    sidebar.productDetailsNewTab = this.productDetailsNewTab;
    sidebar.productDetailsRedirect = this.productDetailsRedirect;
    sidebar.widgetVersion = version;
    sidebar.showingInButton = true;
    sidebar.excluded = this.excluded;
    sidebar.addToBasketShow = this.addToBasketShow;
    sidebar.buttonChildren = this.el.children;
    sidebar.showFilters = this.showFilters;
    sidebar.cssUrl = this.cssUrl;
    sidebar.setItemsAmount = this.setItemsAmount;
    sidebar.setModeDiscounts = this.setModeDiscounts;
    sidebar.updateButtonLocation = this.updateButtonLocation;
    sidebar.addPriceContainer = this.addPriceContainer;
    sidebar.favoriteShow = this.favoriteShow;
    sidebar.showInModal = this.oneClickDiscoveryMode === "modal";
    sidebar.isAppended =
      !!this.targetAppendSidebarTo || !!this.appendSidebarToElement;
    sidebar.showInWidget = this.showInWidget;
    sidebar.uiSessionId = this.uiSessionId;
    sidebar.triggerElement = this.el;

    if (this.targetAppendSidebarTo) {
      sidebar.mode = "grid";
      sidebar.useCarousel = this.oneClickDiscoveryMode === "append-slider";
    } else {
      sidebar.mode = this.position === "right" ? "grid" : this.mode;
      sidebar.useCarousel = this.position === "bottom";
    }
    this.sidebar = sidebar;

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;
    addEventListenersWithSignal(
      document,
      [
        ["vviinnWidgetClose", () => this.sidebarCloseListener(false)],
        ["vviinnStorybookStoryChanged", () => this.sidebarCloseListener(true)],
      ],
      signal,
    );

    if (this.targetAppendSidebarTo) {
      this.sidebar.showInCustomContainer = true;
      this.targetAppendSidebarTo.innerHTML = "";
      this.targetAppendSidebarTo.append(this.sidebar);

      return;
    }

    document.body.append(this.sidebar);
  }

  disconnectedCallback() {
    this.eventAbortController?.abort();
    this.disposeStoreListener?.();
  }
}
