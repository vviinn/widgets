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
 * @slot vviinn-onboarding-title - Title of onboarding section.
 * @slot onboarding-card-1-icon - Icon (or other graphics) on the first onboarding slide.
 * @slot onboarding-card-1-text - Text content of first onboarding slide.
 * @slot onboarding-card-2-icon - Icon (or other graphics) on the second onboarding slide.
 * @slot onboarding-card-2-text - Text content of second onboarding slide.
 * @slot onboarding-card-3-icon - Icon (or other graphics) on the third onboarding slide.
 * @slot onboarding-card-3-text - Text content of third onboarding slide.
 * @slot vviinn-example-images-title - Header of Example Images block.
 * @slot vviinn-example-images-1 - First image in Example Images block.
 * @slot vviinn-example-images-2 - Second image in Example Images block.
 * @slot vviinn-example-images-3 - Third image in Example Images block.
 * @slot vviinn-example-images-4 - Fourth image in Example Images block.
 * @slot vviinn-teaser-text - Text on widget's main screen.
 * @slot vviinn-image-upload-button-text - Title of Upload Button.
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block.
 * @slot vviinn-image-search-modal-title - Image search modal title.
 *
 * @part brand - Brand inside Product Card.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-container - Block of prices.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part title - Title inside Product Card.
 * @part example-images - Example Images block.
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
  /** Excuded filter, brand:Nike;custom_label_0:summer */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailNewTab: boolean = true;

  /** @internal */
  @Prop() apiPath: string | undefined;

  @State() buttonPressed: boolean = false;

  /** The event emits on widget load. */
  @Event() vviinnWidgetLoad: EventEmitter<BasicEventData>;
  /** The event emits on modal open. */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;
  /** The event emits on modal close. */
  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  /** The image was uploaded */
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
          active={this.buttonPressed}
          excluded={this.excluded}
          productDetailNewTab={this.productDetailNewTab}
        />
      </Host>
    );
  }
}
