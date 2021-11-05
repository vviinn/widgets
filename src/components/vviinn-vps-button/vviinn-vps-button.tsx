import { Component, Host, h, Prop, State, Listen, Element, Event, EventEmitter } from "@stencil/core";
import { CameraIcon } from "../vviinn-icons";
import { SlotSkeleton } from "../vviinn-skeleton/test";

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

  @State() pressed: boolean = false;

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
        <SlotSkeleton />
        <slot name="vviinn-vps-button-icon">
          <CameraIcon />
        </slot>
        <vviinn-vps-widget
          active={this.pressed}
          currency-sign="€"
          token={this.token}
        />
      </Host>
    );
  }
}
