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
import { CampaignName } from "../../../campaign/Campaign";
import { Locale } from "../../../locale";
import { UpdateButtonLocation } from "../../vviinn-vpr-widget/vviinn-vpr-widget";
import { ClickEvent, isClickedInRectBound } from "../../../geometry/Rectangle";
import { Recommendation } from "../../../components";

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
  @Prop() pricePrefix: string;
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
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() showingInButton: boolean;

  @State() state: SidebarState = "idle";
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

    if (!isClickedInRectBound(event, sidebarRect)) {
      this.state = "closed";
    }
  }

  @Listen("sourceProductReceived")
  sourceProductReceived(event: CustomEvent<Recommendation>) {
    this.sourceProduct = event.detail;
  }

  private getClassMap() {
    return {
      [this.position]: true,
      [this.state]: true,
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
      <Host class={this.getClassMap()} exportparts="body">
        <aside
          class="sidebar"
          part="body"
          onAnimationEnd={(e) => this.handleAnimationEnd(e)}
        >
          {this.mode !== "set" && (
            <header
              class={{ "contains-source-img": this.isSourceImageValid() }}
              part="sidebar-header"
            >
              {this.renderSourceImage()}
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
          )}

          <main part="sidebar-content">
            <vviinn-vpr-widget
              exportparts="image-container, content-container, basket-button-container,brand, product-type, currency, deeplink, image, image-link, image-picture, price-container, price-amount, price-prefix, price-outdated, price-regular, price-amount-base-regular, price-amount-base-sale, price-amount-base-outdated, price-sale, custom-label-0, custom-label-1, custom-label-2, custom-label-3, custom-label-4, title: product-title, carousel-button, product-card, items-group, energy-label-container, energy-label-icon, energy-label-product-type, energy-label-data-sheet-link, product-card-top-actions"
              token={this.token}
              productId={this.productId}
              imageWidth={this.imageWidth}
              imageRatio={this.imageRatio}
              setItemsAmount={this.setItemsAmount}
              blockTitle=""
              mode={this.mode}
              campaign-type={this.campaignType}
              useCarousel={this.useCarousel}
              onVviinnRecommendationsLoaded={() => (this.state = "open")}
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
              closed={this.state === "closed"}
              opened={this.state === "open"}
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
