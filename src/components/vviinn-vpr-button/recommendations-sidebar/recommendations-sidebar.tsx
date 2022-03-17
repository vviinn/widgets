import {
  Component,
  Host,
  h,
  Prop,
  State,
  Listen,
  Element,
  Event,
  EventEmitter,
} from "@stencil/core";
import { CrossIcon } from "../../vviinn-icons";

type SidebarState = "idle" | "open" | "closed";
type ClickEvent = Event & { clientX: number; clientY: number };

@Component({
  tag: "vviinn-recommendations-sidebar",
  styleUrl: "recommendations-sidebar.css",
  shadow: true,
})
export class RecommendationsSidebar {
  @Element() el: HTMLElement;

  @Prop() sidebarTitle: string;
  @Prop() token: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";
  @Prop() sourceImage: string | null = null;
  @Prop() widgetScrollbar: boolean = false;

  @State() state: SidebarState = "idle";

  @Event() modalClosed: EventEmitter<void>;

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
        <aside
          class="sidebar"
          part="body"
          onAnimationEnd={(e) => this.handleAnimationEnd(e)}
        >
          <header
            class={{ "contains-source-img": this.isSourceImageValid() }}
            part="sidebar-header"
          >
            {this.isSourceImageValid() ? this.renderSourceImage() : null}
            <span class="title" part="title">
              {this.sidebarTitle}
            </span>
            <button
              class="close-sidebar"
              onClick={() => (this.state = "closed")}
            >
              <CrossIcon />
            </button>
          </header>
          <main part="sidebar-content">
            <vviinn-vpr-widget
              exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title: product-title"
              token={this.token}
              productId={this.productId}
              imageWidth={300}
              blockTitle=""
              mode={this.position === "bottom" ? "continuity" : "grid"}
              useCarousel={this.position === "bottom"}
              onRecommendationsLoaded={() => (this.state = "open")}
              showScroll={this.widgetScrollbar}
            />
          </main>
        </aside>
      </Host>
    );
  }

  private renderSourceImage(): HTMLImageElement {
    return (
      <img class="source-image" part="source-image" src={this.sourceImage} />
    );
  }

  private isSourceImageValid(): boolean {
    return this.sourceImage?.length > 0;
  }

  private handleAnimationEnd({ animationName }: AnimationEvent): void {
    const isClosingAnimation = animationName.includes("slideOut");
    if (!isClosingAnimation) return;

    this.modalClosed.emit();
  }
}
