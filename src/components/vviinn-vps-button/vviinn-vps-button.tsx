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
        onClick={() => this.handleClick()}
        onKeyDown={(ev: KeyboardEvent) => this.handleKeyDown(ev)}
      >
        <slot>
          <CameraIcon />
        </slot>
        <SlotSkeleton />
        <vviinn-vps-widget
          active={this.pressed}
          currency-sign="€"
          token={this.token}
          locale={this.locale}
          apiPath={this.apiPath}
          exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title, product-card"
        />
      </Host>
    );
  }
}
