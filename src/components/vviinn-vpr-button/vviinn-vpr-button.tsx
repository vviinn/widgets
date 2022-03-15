import { Component, Host, h, Prop } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";

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
    const sidebar = document.createElement("recommendations-sidebar") as any;
    sidebar.sidebarTitle = "Visually similar product";
    sidebar.productId = this.productId;
    sidebar.token = this.token;
    sidebar.position = this.position;

    document.body.append(sidebar);
  }
}
