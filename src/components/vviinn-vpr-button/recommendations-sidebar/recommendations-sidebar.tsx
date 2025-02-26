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
  Fragment,
} from "@stencil/core";
import { CrossIcon } from "../../vviinn-icons";
import { CarouselMode } from "../../vviinn-carousel/vviinn-carousel";
import { BasicEventData } from "../../../recommendation/events";
import { CampaignName } from "../../../campaign/Campaign";
import { Locale } from "../../../locale";
import { UpdateButtonLocation } from "../../vviinn-vpr-widget/vviinn-vpr-widget";
import { ClickEvent, isClickedInRectBound } from "../../../geometry/Rectangle";
import { Recommendation } from "../../../components";
import { carouselParts, productCardParts } from "../../../cssParts";

type SidebarState = "idle" | "open" | "closed";

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
  @Prop() widgetScrollbar: boolean = false;
  @Prop() mode: CarouselMode = "continuity";
  /** comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  @Prop() campaignType: CampaignName;
  @Prop() color: string;
  @Prop() locale: Locale;
  @Prop() imageWidth: number = 300;
  @Prop() imageRatio: number;
  @Prop() cssUrl: string | null;
  @Prop() currencySign: string = "€";
  @Prop() pricePrefix: string = "";
  @Prop() noResultText: string;
  @Prop() noResultShow: boolean;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean;
  @Prop() excluded: string;
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  @Prop() showFilters: boolean = false;
  @Prop() setModeDiscounts: string;
  @Prop() setItemsAmount?: number;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() favoriteShow: boolean = false;
  @Prop() useCarousel: boolean = true;

  /** @internal */
  @Prop() showInCustomContainer: boolean = false;
  /** @internal */
  @Prop() buttonChildren: HTMLCollection;
  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() showingInButton: boolean;
  /** @internal */
  @Prop() showInModal: boolean = false;

  @State() sidebarState: SidebarState = "idle";
  @State() sourceProduct?: Recommendation;

  @Event() vviinnWidgetClose: EventEmitter<BasicEventData>;

  @Listen("vviinnUpdatingAllCardsStarted")
  updatingAllCardsStarted() {
    const { height } = this.getSidebarRectangle();
    const aside = this.getAsideElement();
    if (aside.style.height !== `${height}px`) {
      aside.style.height = `${height}px`;
    }
  }

  @Listen("vviinnUpdatingAllCardsFinished")
  updatingAllCardsFinished() {
    const aside = this.getAsideElement();
    if (aside.style.height !== "auto") {
      aside.style.height = "auto";
    }
  }

  @Listen("click", { target: "body" })
  bodyClickListener(event: ClickEvent) {
    const sidebarRect = this.getSidebarRectangle();

    if (!sidebarRect) return;

    if (this.showInModal && !isClickedInRectBound(event, sidebarRect)) {
      this.sidebarState = "closed";
    }
  }

  @Listen("sourceProductReceived")
  sourceProductReceived(event: CustomEvent<Recommendation>) {
    this.sourceProduct = event.detail;
  }

  private getClassMap() {
    return {
      [this.position]: true,
      [this.sidebarState]: true,
      "no-fixed": this.showInCustomContainer,
    };
  }

  private getAsideElement(): HTMLElement {
    return this.el.shadowRoot.querySelector("aside");
  }

  private getSidebarRectangle(): DOMRect {
    return this.getAsideElement()?.getBoundingClientRect();
  }

  componentDidLoad() {
    const widgetElement = this.el.shadowRoot.querySelector("vviinn-vpr-widget");
    Array.from(this.buttonChildren).forEach((child) => {
      const childClone = child.cloneNode(true);
      if (child.hasAttribute("slot")) {
        widgetElement.appendChild(childClone);
      }
    });
  }

  render() {
    return (
      <Host class={this.getClassMap()} exportparts="body, close-sidebar">
        <aside
          class="sidebar"
          part="body"
          onAnimationEnd={(e) => this.handleAnimationEnd(e)}
        >
          <header
            class={{ "contains-source-img": this.isSourceImageValid() }}
            part="sidebar-header"
          >
            {this.mode !== "set" && (
              <Fragment>
                {this.renderSourceImage()}
                <span class="title" part="recommendations-title">
                  {this.sidebarTitle}
                </span>
              </Fragment>
            )}
            <button
              class="close-sidebar"
              onClick={() => (this.sidebarState = "closed")}
              part="close-sidebar"
            >
              <CrossIcon />
            </button>
          </header>

          <main part="sidebar-content">
            <vviinn-vpr-widget
              exportparts={`${carouselParts}, ${productCardParts}`}
              token={this.token}
              productId={this.productId}
              imageWidth={this.imageWidth}
              imageRatio={this.imageRatio}
              setItemsAmount={this.setItemsAmount}
              blockTitle=""
              mode={this.mode}
              campaign-type={this.campaignType}
              useCarousel={this.useCarousel}
              onVviinnRecommendationsLoaded={() => (this.sidebarState = "open")}
              showScroll={this.widgetScrollbar}
              campaigns={this.campaigns}
              color={this.color}
              currencySign={this.currencySign}
              pricePrefix={this.pricePrefix}
              apiPath={this.apiPath}
              locale={this.locale}
              buttonElementId={this.buttonElementId}
              noResultText={this.noResultText}
              noResultShow={this.noResultShow}
              gridArrowsDynamic={this.gridArrowsDynamic}
              showingInButton={this.showingInButton}
              excluded={this.excluded}
              productDetailsNewTab={this.productDetailsNewTab}
              productDetailsRedirect={this.productDetailsRedirect}
              closed={this.sidebarState === "closed"}
              opened={this.sidebarState === "open"}
              addToBasketShow={this.addToBasketShow}
              cssUrl={this.cssUrl}
              showFilters={this.showFilters}
              setModeDiscounts={this.setModeDiscounts}
              updateButtonLocation={this.updateButtonLocation}
              addPriceContainer={this.addPriceContainer}
              favoriteShow={this.favoriteShow}
            />
          </main>
        </aside>
      </Host>
    );
  }

  private renderSourceImage(): HTMLImageElement {
    const sourceImageSrc =
      this.sourceProduct?.image?.thumbnail ??
      this.sourceProduct?.image?.original ??
      null;

    if (!sourceImageSrc) return null;

    return (
      <img class="source-image" part="source-image" src={sourceImageSrc} />
    );
  }

  private isSourceImageValid = (): boolean => !!this.sourceProduct?.image;

  private handleAnimationEnd({ animationName }: AnimationEvent): void {
    const isClosingAnimation = animationName.includes("slideOut");
    if (!isClosingAnimation) return;
  }
}
