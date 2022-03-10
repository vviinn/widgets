import { Component, Host, h, Prop } from "@stencil/core";

@Component({
  tag: "recommendations-sidebar",
  styleUrl: "recommendations-sidebar.css",
  shadow: true,
})
export class RecommendationsSidebar {
  @Prop() sidebarTitle: string;
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";

  render() {
    return (
      <Host class={this.position}>
        <div class="sidebar">
          <span class="title">{this.sidebarTitle}</span>
          <vviinn-vpr-widget
            token={this.token}
            productId={this.productId}
            imageWidth={300}
            blockTitle=""
            mode={this.position === "bottom" ? "continuity" : "grid"}
          />
        </div>
      </Host>
    );
  }
}
