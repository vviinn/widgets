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

/**
 * @slot vviinn-onboarding-title - Title of onboarding section
 * @slot vviinn-onboarding-card-1-icon - Icon (or other graphics) on first onboarding slide
 * @slot vviinn-onboarding-card-1-text - Text content of first onboarding slide
 * @slot vviinn-onboarding-card-2-icon - Icon (or other graphics) on second onboarding slide
 * @slot vviinn-onboarding-card-2-text - Text content of second onboarding slide
 * @slot vviinn-onboarding-card-3-icon - Icon (or other graphics) on third onboarding slide
 * @slot vviinn-onboarding-card-3-text - Text content of third onboarding slide
 * @slot vviinn-example-images-title - Header of example images block
 * @slot vviinn-example-images-1 - First image in example images block
 * @slot vviinn-example-images-2 - Second image in example images block
 * @slot vviinn-example-images-3 - Third image in example images block
 * @slot vviinn-example-images-4 - Fourth image in example images block
 * @slot vviinn-teaser-text - Text on widget's main screen
 * @slot vviinn-image-upload-button-text - Title of upload button
 * @slot vviinn-privacy-badge-text - Text content of privacy notification block
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
 * @part example-images - example images block
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

  @Listen("modalClosed")
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
          onClick={() => this.handleClick()}
          addStyle={this.addStyle}
        >
          <slot>
            <CameraIcon />
          </slot>
        </vviinn-button>
        <SlotSkeleton />
        <vviinn-vps-widget
          active={this.pressed}
          currency-sign="€"
          token={this.token}
          locale={this.locale}
          apiPath={this.apiPath}
          exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, product-card, example-images"
          campaignId={this.campaignId}
        />
      </Host>
    );
  }
}
