import { Component, Host, h, Prop } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

/**
 * Visual presentation for a button. Does not handle interaction logic itself.
 * This component is not intended to be used directly - only within other button components.
 *
 * @part button - The visual button element.
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
        <div
          class={this.addStyle ? "open-button" : "raw-open-button"}
          part="button"
        >
          <slot>
            <VisualSearchIcon />
          </slot>
        </div>
      </Host>
    );
  }
}
