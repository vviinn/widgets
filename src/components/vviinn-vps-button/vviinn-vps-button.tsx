import { Component, Host, h, Prop, State, Listen } from "@stencil/core";
import { CameraIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-vps-button",
  styleUrl: "vviinn-vps-button.css",
  shadow: false,
})
export class VviinnVpsButton {
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";

  @State() pressed: boolean = false;

  @Listen("modalClosed")
  handleModalClosed() {
    this.pressed = false;
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
        <vviinn-vps-widget
          active={this.pressed}
          currency-sign="€"
          token={this.token}
        />
      </Host>
    );
  }
}
