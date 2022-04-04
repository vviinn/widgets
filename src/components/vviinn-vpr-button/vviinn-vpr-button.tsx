import { Component, Host, h, Prop } from "@stencil/core";
import { VisualSearchIcon } from "../vviinn-icons";

/**
 *
 * @part button - clickable button element
 */
@Component({
  tag: "vviinn-vpr-button",
  styleUrl: "vviinn-vpr-button.css",
  shadow: true,
})
export class VviinnVprButton {
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";
  @Prop() sourceImage: string | null = null;
  @Prop() sidebarTitle: string = "Visually similar products";
  @Prop() modalScrollbar: boolean = false;

  private sidebar: HTMLVviinnRecommendationsSidebarElement | null = null;
  private sidebarCloseListener: () => void = () => {
    document.body.removeChild(this.sidebar);
  }

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
    const sidebar = document.createElement("vviinn-recommendations-sidebar");
    sidebar.sidebarTitle = this.sidebarTitle;
    sidebar.productId = this.productId;
    sidebar.token = this.token;
    sidebar.position = this.position;
    sidebar.sourceImage = this.sourceImage;
    sidebar.widgetScrollbar = this.modalScrollbar;
    this.sidebar = sidebar;

    sidebar.addEventListener("modalClosed", this.sidebarCloseListener);
    document.body.append(this.sidebar);
  }

  disconnectedCallback() {
    this.sidebar.removeEventListener("modalCLosed", this.sidebarCloseListener);
    document.body.removeChild(this.sidebar);
  }
}
