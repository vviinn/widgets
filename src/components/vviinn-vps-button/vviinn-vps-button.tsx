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
import { CameraIcon } from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
import {
  BasicEventData,
  ProductCardEventData,
  SelectFilterEventData,
  SelectObjectEventData,
} from "../../recommendation/events";
import { campaignTypeNames } from "../../campaign/Campaign";

/**
 * @slot vviinn-onboarding-title - Title of onboarding section
 * @slot onboarding-card-1-icon - Icon (or other graphics) on first onboarding slide
 * @slot onboarding-card-1-text - Text content of first onboarding slide
 * @slot onboarding-card-2-icon - Icon (or other graphics) on second onboarding slide
 * @slot onboarding-card-2-text - Text content of second onboarding slide
 * @slot onboarding-card-3-icon - Icon (or other graphics) on third onboarding slide
 * @slot onboarding-card-3-text - Text content of third onboarding slide
 * @slot vviinn-example-images-title - Header of example images block
 * @slot vviinn-example-images-1 - First image in example images block
 * @slot vviinn-example-images-2 - Second image in example images block
 * @slot vviinn-example-images-3 - Third image in example images block
 * @slot vviinn-example-images-4 - Fourth image in example images block
 * @slot vviinn-teaser-text - Text on widget's main screen
 * @slot vviinn-image-upload-button-text - Title of upload button
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block
 * @slot vviinn-image-search-modal-title - Image search modal title
 *
 * @part brand - product brand.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount-sale - numeric part of price.
 * @part price-amount-outdated - numeric part of price.
 * @part price-amount-regular - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part title - product title
 * @part example-images - example images block
 * @part button - Clickable button element.
 * @part vviinn-button - Button element container.
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
  /** The locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** Campaign ID applied for visual search */
  @Prop() campaignId: string = "";
  /** Add style to the button */
  @Prop() addStyle: boolean = false;
  /** Show the onboarding step or skip it and move to the direct image upload. */
  @Prop() mode: "modal" | "upload" = "modal";

  /** @internal */
  @Prop() apiPath: string | undefined;

  @State() buttonPressed: boolean = false;

  /** The event emits on widget load. */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;
  /** The event emits on modal open. */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;
  /** The event emits on modal close. */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The image uploaded */
  @Event() vviinnImageUpload: EventEmitter<BasicEventData>;
  /** Wrong image format, that isn’t .jpg, .jpeg, png, or the request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;
  /** The recommendation renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** The recommendation appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

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
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit(Array.from(slots));
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
            <CameraIcon />
          </slot>
        </vviinn-button>

        <SlotSkeleton />
        <vviinn-vps-widget
          mode={this.mode}
          currency-sign={this.currencySign}
          token={this.token}
          locale={this.locale}
          apiPath={this.apiPath}
          exportparts="brand, deeplink, currency, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, title, product-card, example-images"
          campaignId={this.campaignId}
          showingInButton={true}
          buttonPressed={this.buttonPressed}
          resetVpsButton={this.resetButton.bind(this)}
          buttonElementId={this.el.id}
        />
      </Host>
    );
  }
}
