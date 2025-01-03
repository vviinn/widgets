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
import { version } from "../../../package.json";
import { SimilarProductsIcon, CrossSellingIcon } from "../vviinn-icons";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { CampaignName } from "../../campaign/Campaign";
import {
  BasicEventData,
  ProductCardEventData,
} from "../../recommendation/events";
import { Locale } from "../../locale";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
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
 * @part carousel-button - Button for carousel navigation.
 * @part recommendations-results - For internal usage only!
 * @part recommendations-title - Title of the recommendations grid.
 * @part recommendations-subtitle - Subtitle of the recommendations grid.
 * @part basket-button - Add to Basket button.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part update-button-top - Update Button on the top (Set mode).
 * @part update-button-item - Update Button inside the Product Card (Set mode).
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
 * @slot vviinn-basket-button-icon - Text of Add to Basket icon.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 *
 * @slot vviinn-recommendations-subtitle - Recommendations subtitle text (Set mode).
 * @slot vviinn-update-button-text - Text of Update Button on the top (Set mode).
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 */

@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Element() el: HTMLElement;
  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** ID of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Switch between carousel modes */
  @Prop() mode: CarouselMode = "continuity";
  /** Comma-separated list of campaign IDs */
  @Prop() campaigns: string = "";
  /** Excluded filter. Example: "brand:Nike;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = this.mode === "set" ? "VCS" : "VPR";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** The ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Items amount in set mode grid */
  @Prop() setItemsAmount?: number;
  /** Optional for custom CSS. It will overwrite all other settings */
  @Prop() cssUrl: string | null = null;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** Prefix is displayed before the price */
  @Prop() pricePrefix: string = "";
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

  /** List of discounts for Set mode. Example: "5, 10, 15, 20" (could be less than 4 numbers) */
  @Prop() setModeDiscounts: string = this.mode === "set" ? "5, 10, 15" : "";
  /** Location of Update button for Set mode */
  @Prop() updateButtonLocation: UpdateButtonLocation = "topAndItem";

  /** Sidebar title (change it to fit your locale) */
  @Prop() sidebarTitle: string = this.mode === "set" ? "" : "Similar products";
  /** Show or hide the scrollbar */
  @Prop() modalScrollbar: boolean = false;
  /** Position of the modal */
  @Prop() position: "bottom" | "right" = "bottom";
  /** Add default styles to the button */
  @Prop() addStyle: boolean = true;

  /** ID of an HTML element that you want to attach the sidebar  */
  @Prop() appendSidebarTo: string;

  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;

  @Prop() appendSidebarToElement: HTMLElement;

  /** One click Discovery mode*/
  @Prop() oneClickDiscoveryMode?: "modal" | "append-grid" | "append-slider";

  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";

  /** Event emitted on widget load */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Event emitted on modal open */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** Event emitted on modal close */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Click on the product’s link */
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

  @State() targetAppendSidebarTo: HTMLElement;

  componentWillLoad() {
    if (this.appendSidebarToElement) {
      this.targetAppendSidebarTo = this.appendSidebarToElement;
    } else if (this.appendSidebarTo) {
      this.targetAppendSidebarTo = document.getElementById(
        this.appendSidebarTo
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
  private sidebarCloseListener: () => void = () => {
    if (this.targetAppendSidebarTo) {
      this.targetAppendSidebarTo.removeChild(this.sidebar);
      return;
    }

    document.body.removeChild(this.sidebar);
  };

  render() {
    return (
      <Host
        onClick={(): void => {
          if (this.appendSidebarTo && !this.targetAppendSidebarTo) {
            setTimeout(() => {
              this.handleClick();
            }, 250);
          } else {
            this.handleClick();
          }
        }}
        role="button"
        tabindex="0"
      >
        <vviinn-button addStyle={this.addStyle} part="vviinn-button">
          <slot>
            {this.campaignType === "VCS" ? (
              <CrossSellingIcon width={14} height={14} />
            ) : (
              <SimilarProductsIcon width={14} height={14} />
            )}
          </slot>
        </vviinn-button>
      </Host>
    );
  }

  handleClick(): void {
    const sidebar = document.createElement("vviinn-recommendations-sidebar");
    sidebar.sidebarTitle = this.sidebarTitle;
    sidebar.productId = this.productId;
    sidebar.token = this.token;
    sidebar.position = this.position;
    sidebar.widgetScrollbar = this.modalScrollbar;
    sidebar.campaigns = this.campaigns;
    sidebar.campaignType = this.campaignType;
    sidebar.color = this.color;
    sidebar.locale = this.locale;
    sidebar.imageWidth = this.imageWidth;
    sidebar.currencySign = this.currencySign;
    sidebar.pricePrefix = this.pricePrefix;
    sidebar.apiPath = this.apiPath;
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
    sidebar.imageRatio = this.imageRatio;
    sidebar.setItemsAmount = this.setItemsAmount;
    sidebar.setModeDiscounts = this.setModeDiscounts;
    sidebar.updateButtonLocation = this.updateButtonLocation;
    sidebar.addPriceContainer = this.addPriceContainer;
    sidebar.favoriteShow = this.favoriteShow;

    if (this.targetAppendSidebarTo) {
      sidebar.mode = "grid";
      sidebar.useCarousel = this.oneClickDiscoveryMode === "append-slider";
    } else {
      sidebar.mode = this.position === "right" ? "grid" : this.mode;
      sidebar.useCarousel = this.position === "bottom";
    }

    this.sidebar = sidebar;

    sidebar.addEventListener("vviinnWidgetClose", this.sidebarCloseListener);

    if (this.targetAppendSidebarTo) {
      this.sidebar.showInCustomContainer = true;
      this.targetAppendSidebarTo.innerHTML = "";
      this.targetAppendSidebarTo.append(this.sidebar);

      return;
    }

    document.body.append(this.sidebar);
  }

  disconnectedCallback() {
    if (!this.sidebar) return;

    this.sidebar.removeEventListener(
      "vviinnWidgetClose",
      this.sidebarCloseListener
    );
  }
}
