import { Component, Host, h, Prop } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

/**
 *
 * @part button - Clickable button element.
 */
@Component({
  tag: "vviinn-button",
  styleUrl: "vviinn-button.css",
  shadow: true,
})
export class VviinnButton {
  @Prop() addStyle: boolean = true;

  render() {
    return (
      <Host exportparts="button">
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
