import { Component, Host, h } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

/**
 *
 * @part button - clickable button element
 */
@Component({
  tag: "vviinn-button",
  styleUrl: "vviinn-button.css",
  shadow: true,
})
export class VviinnButton {
  render() {
    return (
      <Host>
        <button class="open-button" part="button">
          <slot>
            <VisualSearchIcon />
          </slot>
        </button>
      </Host>
    );
  }
}
