import { Component, Host, h, Prop, State, Listen, Element, Event, EventEmitter } from "@stencil/core";
import { CameraIcon } from "../vviinn-icons";
import { SlotSkeleton } from "../customized-slots";
import state from "../../store/store";

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
  @Event({ bubbles: true, composed: true }) globalSlotsChanged: EventEmitter<any>;

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
        />
      </Host>
    );
  }
}
