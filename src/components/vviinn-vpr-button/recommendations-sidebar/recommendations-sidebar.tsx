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
import { CarouselMode } from "../../vviinn-carousel/vviinn-carousel";
import { BasicEventData } from "../../../recommendation/events";
import { CampaignTypeId, campaignTypeTitles } from "../../../campaign/Campaign";

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
  @Prop() mode: CarouselMode = "continuity";
  /** comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  @Prop() campaignType: CampaignTypeId;
  @Prop() color: string;
  @Prop() imageWidth: number = 300;
  @Prop() currencySign: string = "€";
  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";
  @Prop() buttonElementId?: string;
  @Prop() noResultText?: string;

  @State() state: SidebarState = "idle";

  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

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
              exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-prefix, price-outdated, price-regular, price-sale, title: product-title, carousel-button, product-card, items-group"
              token={this.token}
              productId={this.productId}
              imageWidth={this.imageWidth}
              blockTitle=""
              mode={this.mode}
              useCarousel={this.position === "bottom"}
              onVviinnRecommendationsLoaded={() => (this.state = "open")}
              showScroll={this.widgetScrollbar}
              campaigns={this.campaigns}
              color={this.color}
              currencySign={this.currencySign}
              apiPath={this.apiPath}
              buttonElementId={this.buttonElementId}
              noResultText={this.noResultText}
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

    this.vviinnWidgetClose.emit({
      widgetType: "VPR",
      campaignTypeId: this.campaignType,
      campaignTypeTitle: campaignTypeTitles[this.campaignType],
      id: this.buttonElementId,
    });
  }
}
