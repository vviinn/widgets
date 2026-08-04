import {
  Component,
  Host,
  h,
  Prop,
  State,
  Listen,
  Element,
  Event,
  EventEmitter,
  Watch,
} from "@stencil/core";
import {
  SearchModalCameraIcon,
  SearchModalFullSearchIcon,
  SearchModalImageSearchIcon,
} from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
import {
  BasicEventData,
  ImageUploadEventData,
  ProductCardEventData,
  SelectFilterEventData,
  SelectObjectEventData,
  TriggerSourceEventData,
} from "../../recommendation/events";
import { Locale } from "../../locale";
import { DEFAULT_EXAMPLE_IMAGE } from "../../assets/constants";
import {
  OneClickDiscoveryAppendMode,
  VisualSearchMode,
} from "../../widget/types";
import { findSlotElements, hasDefaultSlotContent } from "../../dom";
import { SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH } from "../../widget/constants";
import { searchModalFirstScreenParts } from "../../cssParts";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
import i18next from "i18next";
import { initializeLocale } from "../../locale";

/**
 * @slot vviinn-teaser-text - Text on the widget's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button.
 * @slot vviinn-image-upload-icon - Icon of Upload Button.
 * @slot vviinn-drag-drop-icon - Icon of the drag & drop zone.
 * @slot vviinn-drag-drop-text - Hint text of the drag & drop zone.
 * @slot vviinn-camera-button-text-start - Title of Start Camera button.
 * @slot vviinn-camera-button-text-stop - Title of Stop Camera button (for Desktop).
 * @slot vviinn-camera-icon - Icon of Camera Button.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block.
 * @slot vviinn-image-search-modal-title - Image search modal title.
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 * @slot vviinn-results-vpr-icon - One-Click Discovery icon
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-suggestions-title - Custom title text to replace default "AI Suggestions".

 * @slot vviinn-suggestions-icon - Custom icon to replace default sparkle emoji.
 *
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part results-title - Title on the results page.
 * @part upload-photo_button - Upload Photo Button.
 * @part drop-zone - Drag & drop container (when useDragAndDrop is enabled).
 * @part start-camera_button - Start Camera Button.
 * @part products - Products container.
 * @part product-card - Product Card itself.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
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
 * @part title - Title inside Product Card.
 * @part basket-button - Add to Basket button.
 * @part basket-button-container - Product Card's basket button container.
 * @part favorite-button - Favorite button.
 * @part product-card-actions - Product Card actions wrapper.
 * @part product-card-actions-top - Product Card top actions wrapper.
 * @part text-search-input - Text search input.
 * @part button - Clickable button element.
 * @part vviinn-button - Button element container.
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part product-images-pagination - Container for product images pagination dots (mobile only).
 * @part product-images-pagination-bullet - Individual pagination dot.
 * @part product-images-pagination-bullet-active - Active pagination dot.
 * @part suggestions-container - The main suggestions container element.
 * @part suggestions-header - The header section containing icon and title.
 * @part suggestions-icon - The sparkle icon wrapper.
 * @part suggestions-title - The title text element.
 * @part suggestions-description - The description text element.
 * @part suggestions-wrapper - The wrapper around the suggestions list.
 * @part suggestions-list - The list container for all suggestions.
 * @part suggestion-item - Individual suggestion item.
 * @part suggestion-link - Clickable suggestion text/link.
 * @part suggestion-filter-button - Toggle button for filter suggestions.
 */
@Component({
  tag: "vviinn-vps-button",
  styleUrl: "vviinn-vps-button.css",
  shadow: true,
})
export class VviinnVpsButton {
  @Element() el: HTMLElement;
  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Locale for number formatting. Falls back to locale */
  @Prop() numberLocale?: string;
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** Campaign ID used for Visual Search (deprecated) */
  @Prop() campaignId: string = "";
  /** Campaign ID used for Text Search */
  @Prop() campaignIdTextSearch: string = "";
  /** Campaign ID used for Visual Search */
  @Prop() campaignIdVisualSearch: string = "";
  /** Add style to the button */
  @Prop() addStyle: boolean = false;
  /** Show the onboarding step, start the camera on opening, or skip the onboarding and move to the direct image upload. */
  @Prop() mode: VisualSearchMode = "modal";
  /** Excluded filter. Example: "brand:Nike,Vans;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = true;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number = SEARCH_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Show multiple images: swiper on mobile, hover on desktop in product cards */
  @Prop() showMultipleImages: boolean = false;
  /** Accept image files dropped from the OS onto the upload button (desktop only) */
  @Prop() useDragAndDrop: boolean = false;
  /** Example image source */
  @Prop() exampleImageSource: string = DEFAULT_EXAMPLE_IMAGE;
  /** Show the text search */
  @Prop() textSearchShow: boolean = false;
  /** Show auto-suggest dropdown with search completions */
  @Prop() autoSuggestShow: boolean = true;
  /** Show the AI Suggestions block in search results */
  @Prop() aiSuggestionsShow: boolean = false;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** One-Click Discovery mode, restricted to append only (no modal supported for this component)*/
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryAppendMode = "append-grid";
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  /** Show editable input fields in interval filters instead of readonly labels */
  @Prop() showIntervalInputs: boolean = false;
  /** URL to external CSS file for custom styling */
  @Prop() cssUrl: string | null = null;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
  /** Render results in modal. Set false to redirect or show results on the page. */
  @Prop() showResultsInModal?: boolean = true;
  /** URL of the results page for automatic search redirect. */
  @Prop() resultsPageUrl?: string;
  /** Custom URL param names for results page redirect. Default: "query=query&searchId=searchId". */
  @Prop() resultsPageParams?: string;
  /** @internal */
  @Prop() parentSlots?: HTMLSlotElement[] = [];

  @State() buttonPressed: boolean = false;

  /** Event emitted on widget load. */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Event emitted on modal open. */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** Event emitted on modal close. */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The image upload has started */
  @Event() vviinnImageUploadStarted: EventEmitter<ImageUploadEventData>;

  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Click on the product's link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The recommendation appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Wrong image format (supported formats depend on the browser), or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Crop area changes */
  @Event() vviinnImageCrop: EventEmitter<TriggerSourceEventData>;
  /** User selects the detected object */
  @Event() vviinnSelectObject: EventEmitter<SelectObjectEventData>;
  /** User selects one of the filters */
  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  private slots?: HTMLSlotElement[] = [];

  // True when the consumer projects real content into the default slot (custom
  // trigger). Whitespace-only text and named-slot children don't count, so
  // formatting newlines around named slots can't suppress the fallback icon.
  // @State + the default slot's slotchange keep this reactive to light-DOM that
  // is projected/removed after load (e.g. deferred hydration, async injection).
  @State() hasCustomTrigger = false;

  @Listen("vviinnWidgetClose")
  handleModalClosed({ detail }: CustomEvent<BasicEventData>) {
    if (detail.campaignTypeId === "VPS") {
      this.buttonPressed = false;
    }
  }

  @Watch("buttonPressed")
  buttonPressedWatcher(newValue: boolean, oldValue: boolean) {
    if (oldValue === true && newValue === false) {
      requestAnimationFrame(() => {
        this.el.focus();
      });
    }
  }

  async componentWillLoad() {
    await initializeLocale(this.locale);
    this.slots = findSlotElements(this.el);
    this.hasCustomTrigger = hasDefaultSlotContent(this.el);
  }

  componentDidLoad() {
    this.replaceSlotsContent();
  }

  private allSlots = () => [...this.parentSlots, ...this.slots];

  private replaceSlotsContent(childrenElement?: HTMLElement) {
    this.globalSlotsChanged.emit({
      slots: this.allSlots(),
      element: this.el,
    });

    if (childrenElement) {
      this.globalSlotsChanged.emit({
        slots: this.allSlots(),
        element: childrenElement,
      });
    }
  }

  private handleActivation = () => {
    this.buttonPressed = true;
  };

  private resetButton = () => {
    this.buttonPressed = false;
  };

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") this.handleActivation();
  };

  private getButtonConfig() {
    switch (this.mode) {
      case "camera":
        return {
          ariaLabel: i18next.t("a11y.cameraModeSearchButton"),
          buttonIcon: <SearchModalCameraIcon />,
        };
      case "modal":
        if (this.textSearchShow) {
          return {
            ariaLabel: i18next.t("a11y.modalModeSearchButton"),
            buttonIcon: <SearchModalFullSearchIcon />,
          };
        }
      default:
        return {
          ariaLabel: i18next.t("a11y.uploadModeSearchButton"),
          buttonIcon: <SearchModalImageSearchIcon />,
        };
    }
  }

  render() {
    const { ariaLabel, buttonIcon } = this.getButtonConfig();
    return (
      <Host
        role={this.buttonPressed ? undefined : "button"}
        aria-label={this.buttonPressed ? undefined : ariaLabel}
        exportparts={`vviinn-button, ${searchModalFirstScreenParts}`}
      >
        {renderExternalCSS(this.cssUrl)}
        <vviinn-button
          addStyle={this.addStyle}
          part="vviinn-button"
          tabindex={this.buttonPressed ? undefined : "0"}
          onClick={this.buttonPressed ? undefined : this.handleActivation}
          onKeyDown={this.buttonPressed ? undefined : this.handleKeyDown}
        >
          <span
            style={{ display: this.hasCustomTrigger ? "contents" : "none" }}
          >
            <slot
              onSlotchange={() =>
                (this.hasCustomTrigger = hasDefaultSlotContent(this.el))
              }
            />
          </span>
          {!this.hasCustomTrigger && buttonIcon}
        </vviinn-button>

        {SlotSkeleton("search")}

        <vviinn-vps-widget
          mode={this.mode}
          currency-sign={this.currencySign}
          token={this.token}
          locale={this.locale}
          numberLocale={this.numberLocale}
          apiPath={this.apiPath}
          pricePrefix={this.pricePrefix}
          campaignId={this.campaignId}
          campaignIdTextSearch={this.campaignIdTextSearch}
          campaignIdVisualSearch={this.campaignIdVisualSearch}
          showingInButton={true}
          buttonPressed={this.buttonPressed}
          resetVpsButton={this.resetButton}
          buttonElementId={this.el.id}
          active={
            this.buttonPressed &&
            (this.mode === "modal" || this.mode === "camera")
          }
          excluded={this.excluded}
          productDetailsNewTab={this.productDetailsNewTab}
          productDetailsRedirect={this.productDetailsRedirect}
          imageResolutionWidth={this.imageResolutionWidth}
          showMultipleImages={this.showMultipleImages}
          useDragAndDrop={this.useDragAndDrop}
          exampleImageSource={this.exampleImageSource}
          textSearchShow={this.textSearchShow}
          autoSuggestShow={this.autoSuggestShow}
          aiSuggestionsShow={this.aiSuggestionsShow}
          addToBasketShow={this.addToBasketShow}
          addPriceContainer={this.addPriceContainer}
          showIntervalInputs={this.showIntervalInputs}
          replaceSlotsContentInButton={this.replaceSlotsContent.bind(this)}
          oneClickDiscoveryMode={this.oneClickDiscoveryMode}
          oneClickDiscoveryCampaigns={this.oneClickDiscoveryCampaigns}
          favoriteShow={this.favoriteShow}
          showResultsInModal={this.showResultsInModal}
          resultsPageUrl={this.resultsPageUrl}
          resultsPageParams={this.resultsPageParams}
          parentSlots={[...this.parentSlots, ...this.slots]}
          cssUrl={this.cssUrl}
        />
      </Host>
    );
  }
}
