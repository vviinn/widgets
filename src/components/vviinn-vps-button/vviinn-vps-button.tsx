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
import { CameraIcon } from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
import { BasicEventData } from "../../recommendation/events";
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
 * @part button - button
 */
@Component({
  tag: "vviinn-vps-button",
  styleUrl: "vviinn-vps-button.css",
  shadow: true,
})
export class VviinnVpsButton {
  @Element() el: HTMLElement;
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** Campaign using for visual search */
  @Prop() campaignId?: string;
  /** Add style to the button */
  @Prop() addStyle: boolean = false;

  /** @internal */
  @Prop() apiPath: string | undefined;

  @State() pressed: boolean = false;
  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Event emitted when vps-button clicked */
  @Event() vviinnWidgetOpen: EventEmitter<BasicEventData>;

  @Listen("vviinnWidgetClose")
  handleModalClosed() {
    this.pressed = false;
  }

  componentDidLoad() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit(Array.from(slots));
  }

  private handleKeyDown(ev: KeyboardEvent) {
    if (ev.code !== "Enter" && ev.code !== "Space") return;
    this.pressed = true;
  }

  private handleClick() {
    this.pressed = true;
  }

  render() {
    return (
      <Host
        tabindex="0"
        role="button"
        pressed={this.pressed}
        onKeyDown={(ev: KeyboardEvent) => this.handleKeyDown(ev)}
      >
        <vviinn-button
          onClick={() => {
            this.handleClick();
            this.vviinnWidgetOpen.emit({
              widgetType: "VPS",
              campaignTypeId: "VPS",
              campaignTypeName: campaignTypeNames["VPS"],
              widgetId: this.el.id,
            });
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
          active={this.pressed}
          currency-sign={this.currencySign}
          token={this.token}
          locale={this.locale}
          apiPath={this.apiPath}
          exportparts="brand, deeplink, currency, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, title, product-card, example-images"
          campaignId={this.campaignId}
          showingInButton={true}
          buttonElementId={this.el.id}
        />
      </Host>
    );
  }
}
