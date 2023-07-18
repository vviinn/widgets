import { Component, Host, h, Prop } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-button",
  styleUrl: "vviinn-button.css",
  shadow: true,
})
export class VviinnButton {
  @Prop() addStyle: boolean = true;

  render() {
    return (
      <Host>
        <button
          class={this.addStyle ? "open-button" : "raw-open-button"}
          part="button"
        >
          <slot>
            <VisualSearchIcon />
          </slot>
        </button>
      </Host>
    );
  }
}
