import { Component, Host, h } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  render() {
    return (
      <Host>
        <button
          class="open-button"
          part="button"
          onClick={(): void => this.handleClick()}
        >
          <slot>
            <VisualSearchIcon />
          </slot>
        </button>
      </Host>
    );
  }

  handleClick(): void {
    console.log("Clicked!");
    //throw new Error("Method not implemented.");
  }
}
