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
} from "@stencil/core";
import { version } from "../../../package.json";
import {
  SearchModalCameraIcon,
  SearchModalUploadIcon,
  SearchModalFullSearchIcon,
  SearchModalImageSearchIcon,
} from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
import {
  BasicEventData,
  ProductCardEventData,
  SelectFilterEventData,
  SelectObjectEventData,
} from "../../recommendation/events";
import { campaignTypeNames } from "../../campaign/Campaign";
import { Locale } from "../../locale";
import { DEFAULT_EXAMPLE_IMAGE } from "../../assets/constants";
import { VisualSearchMode } from "../../widget/types";

/**
 * @slot vviinn-teaser-text - Text on the widget's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button.
 * @slot vviinn-image-upload-icon - Icon of Upload Button.
 * @slot vviinn-camera-button-text-start - Title of Start Camera button.
 * @slot vviinn-camera-button-text-stop - Title of Stop Camera button (for Desktop).
 * @slot vviinn-camera-icon - Icon of Camera Button.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block.
 * @slot vviinn-image-search-modal-title - Image search modal title.
 * @slot vviinn-text-search-icon - Icon of the text search block.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 *
 * @part close-button - Close Button in the modal's header.
 * @part secondary-action - Back Button in the modal's header.
 * @part results-title - Title on the results page.
 * @part upload-photo_button - Upload Photo Button.
 * @part start-camera_button - Start Camera Button.
 * @part product-card - Product Card itself.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around troduct title. Rendered only if "deeplink" property is filled.
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
 * @part text-search-input - Text search input.
 * @part button - Clickable button element.
 * @part vviinn-button - Button element container.
 * @part custom-label-0 - custom label with index 0.
 * @part custom-label-1 - custom label with index 1.
 * @part custom-label-2 - custom label with index 2.
 * @part custom-label-3 - custom label with index 3.
 * @part custom-label-4 - custom label with index 4.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 */
@Component({
  tag: "vviinn-vps-button",
  styleUrl: "vviinn-vps-button.css",
  shadow: true,
})
export class VviinnVpsButton {
  @Element() el: HTMLElement;
  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Campaign ID applied for visual search */
  @Prop() campaignId: string = "";
  /** Add style to the button */
  @Prop() addStyle: boolean = false;
  /** Show the onboarding step, start the camera on opening, or skip the onboarding and move to the direct image upload. */
  @Prop() mode: VisualSearchMode = "modal";
  /** Excluded filter. Example: "brand:Nike;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = true;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number = 250;
  /** Example image source */
  @Prop() exampleImageSource: string = DEFAULT_EXAMPLE_IMAGE;
  /** Show the text search */
  @Prop() textSearchShow: boolean = false;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** Show or hide the One-click Discovery */
  @Prop() oneClickDiscoveryShow = false;
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;

  /** Discovery Mode */
  @Prop() oneClickDiscoveryMode: undefined | "append" | "append-slider";

  /** @internal */
  @Prop() apiPath: string | undefined;

  @State() buttonPressed: boolean = false;

  /** Event emitted on widget load. */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Event emitted on modal open. */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  /** Event emitted on modal close. */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The image upload has started */
  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;

  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The recommendation appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Wrong image format, that isn’t .jpg, .jpeg, png, or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Crop area changes */
  @Event() vviinnImageCrop: EventEmitter<BasicEventData>;
  /** User selects the detected object */
  @Event() vviinnSelectObject: EventEmitter<SelectObjectEventData>;
  /** User selects one of the filters */
  @Event() vviinnSelectFilter: EventEmitter<SelectFilterEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  getBasicEventData = (): BasicEventData => {
    return {
      widgetType: "VPS",
      campaignTypeId: "VPS",
      campaignTypeName: campaignTypeNames["VPS"],
      widgetId: this.el.id,
      widgetVersion: version,
    };
  };

  @Listen("vviinnWidgetClose")
  handleModalClosed() {
    this.buttonPressed = false;
  }

  componentDidLoad() {
    this.replaceSlotsContent();
  }

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private handleClick() {
    this.buttonPressed = true;
  }

  private resetButton() {
    this.buttonPressed = false;
  }

  render() {
    return (
      <Host tabindex="0" role="button">
        <vviinn-button
          onClick={() => {
            this.handleClick();
          }}
          addStyle={this.addStyle}
          part="vviinn-button"
        >
          <slot>
            {this.mode === "camera" ? (
              <SearchModalCameraIcon />
            ) : this.mode === "upload" ? (
              <SearchModalUploadIcon />
            ) : this.textSearchShow ? (
              <SearchModalFullSearchIcon />
            ) : (
              <SearchModalImageSearchIcon />
            )}
          </slot>
        </vviinn-button>

        {SlotSkeleton("vps")}

        <vviinn-vps-widget
          mode={this.mode}
          currency-sign={this.currencySign}
          token={this.token}
          locale={this.locale}
          apiPath={this.apiPath}
          campaignId={this.campaignId}
          showingInButton={true}
          buttonPressed={this.buttonPressed}
          resetVpsButton={this.resetButton.bind(this)}
          buttonElementId={this.el.id}
          active={
            this.buttonPressed &&
            (this.mode === "modal" || this.mode === "camera")
          }
          excluded={this.excluded}
          productDetailsNewTab={this.productDetailsNewTab}
          productDetailsRedirect={this.productDetailsRedirect}
          imageResolutionWidth={this.imageResolutionWidth}
          exampleImageSource={this.exampleImageSource}
          textSearchShow={this.textSearchShow}
          addToBasketShow={this.addToBasketShow}
          addPriceContainer={this.addPriceContainer}
          replaceSlotsContentInButton={this.replaceSlotsContent.bind(this)}
          oneClickDiscoveryShow={this.oneClickDiscoveryShow}
          oneClickDiscoveryMode={this.oneClickDiscoveryMode}
          oneClickDiscoveryCampaigns={this.oneClickDiscoveryCampaigns}
          favoriteShow={this.favoriteShow}
        />
      </Host>
    );
  }
}
