import {
  Component,
  Host,
  h,
  Prop,
  State,
  Listen,
  Element,
} from "@stencil/core";

type SidebarState = "idle" | "open" | "closed";
type ClickEvent = Event & { clientX: number; clientY: number };

@Component({
  tag: "recommendations-sidebar",
  styleUrl: "recommendations-sidebar.css",
  shadow: true,
})
export class RecommendationsSidebar {
  @Element() el: HTMLElement;

  @Prop() sidebarTitle: string;
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";

  @State() state: SidebarState = "idle";

  @Listen("click", { target: "body" })
  bodyClickListener(event: ClickEvent) {
    const { clientX, clientY } = event;
    const sidebarRect = this.getSidebarRectangle();

    if (!sidebarRect) return;

    const inLeftBound = clientX >= sidebarRect.left;
    const inRightBound = clientX <= sidebarRect.right;
    const inTopBound = clientY >= sidebarRect.top;
    const inBottomBound = clientY <= sidebarRect.bottom;
    const inBound = inLeftBound && inRightBound && inTopBound && inBottomBound;

    if (!inBound) {
      this.state = "closed";
    }
  }

  private getClassMap() {
    return {
      [this.position]: true,
      [this.state]: true,
    };
  }

  private getSidebarRectangle(): DOMRect {
    return this.el.shadowRoot.querySelector("aside")?.getBoundingClientRect();
  }

  render(): any {
    return (
      <Host class={this.getClassMap()}>
        <aside class="sidebar" onAnimationEnd={(e) => this.handleAnimationEnd(e) }>
          <header part="sidebar-header">
            <span class="title">{this.sidebarTitle}</span>
          </header>
          <main part="sidebar-content">
            <vviinn-vpr-widget
              token={this.token}
              productId={this.productId}
              imageWidth={300}
              blockTitle=""
              mode={this.position === "bottom" ? "continuity" : "grid"}
              useCarousel={this.position === "bottom"}
              onRecommendationsLoaded={() => (this.state = "open")}
            />
          </main>
        </aside>
      </Host>
    );
  }
  handleAnimationEnd(e: AnimationEvent): void {
    console.log(e);
  }
}
