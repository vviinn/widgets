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
  Watch,
} from "@stencil/core";
import { CrossIcon } from "../../vviinn-icons";
import { CarouselMode } from "../../vviinn-carousel/vviinn-carousel";
import { BasicEventData } from "../../../recommendation/events";
import { CampaignName } from "../../../campaign/Campaign";
import { Locale, resources } from "../../../locale";
import { UpdateButtonLocation } from "../../vviinn-vpr-widget/vviinn-vpr-widget";
import { ClickEvent, isClickedInRectBound } from "../../../geometry/Rectangle";
import { Recommendation } from "../../../components";
import { carouselParts, productCardParts } from "../../../cssParts";
import i18next from "i18next";

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
  @Prop() locale: Locale;
  @Prop() currencySign: string;
  @Prop() pricePrefix: string;
  @Prop() productId: string;
  @Prop() position: "bottom" | "right" = "bottom";
  @Prop() widgetScrollbar: boolean = false;
  @Prop() mode: CarouselMode = "continuity";
  /** comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  @Prop() campaignType: CampaignName;
  @Prop() color: string;
  @Prop() imageWidth: number = 300;
  @Prop() imageRatio: number = 1;
  @Prop() cssUrl: string | null;
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
  @Prop() setItemsAmount?: number = 4;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() favoriteShow: boolean = false;
  @Prop() useCarousel: boolean = true;
  @Prop() showInWidget: boolean = false;

  /** @internal */
  @Prop() apiPath: string;
  /** @internal */
  @Prop() showInCustomContainer: boolean = false;
  /** @internal */
  @Prop() buttonChildren: HTMLCollection;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() widgetVersion: string;
  /** @internal */
  @Prop() showingInButton: boolean;
  /** @internal */
  @Prop() showInModal: boolean = false;
  /** @internal */
  @Prop() isAppended: boolean = false;

  @State() sidebarState: SidebarState = "idle";
  @State() sourceProduct?: Recommendation;
  @State() showLoadingClass = false;

  @State() recommendationsLoading: boolean = false;

  private setRecommendationsLoading = (loading: boolean) => {
    this.recommendationsLoading = loading;
  };
  private loadingClassTimeout: ReturnType<typeof setTimeout>;

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

  @Watch("recommendationsLoading")
  handleLoadingChange(loading: boolean) {
    if (loading) {
      this.showLoadingClass = true;
      clearTimeout(this.loadingClassTimeout);
    } else {
      this.loadingClassTimeout = setTimeout(() => {
        this.showLoadingClass = false;
      }, 500);
    }
  }

  private getClassMap() {
    return {
      [this.position]: true,
      [this.sidebarState]: true,
      "no-carousel": !this.useCarousel,
      "no-fixed": this.showInCustomContainer,
      appended: this.isAppended,
      loading: this.showLoadingClass,
    };
  }

  private getAsideElement(): HTMLElement {
    return this.el.shadowRoot.querySelector("aside");
  }

  private getSidebarRectangle(): DOMRect {
    return this.getAsideElement()?.getBoundingClientRect();
  }

  async componentWillLoad() {
    await i18next.init({
      lng: this.locale,
      fallbackLng: "en",
      resources,
    });
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

  disconnectedCallback() {
    clearTimeout(this.loadingClassTimeout);
  }

  render() {
    return (
      <Host
        class={this.getClassMap()}
        exportparts={`body, close-sidebar, ${carouselParts}, ${productCardParts}`}
      >
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
                {this.sidebarTitle?.length !== 0 && (
                  <span class="title" part="recommendations-title">
                    {this.sidebarTitle || i18next.t("discoveryWidgetTitle")}
                  </span>
                )}
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
              token={this.token}
              currencySign={this.currencySign}
              pricePrefix={this.pricePrefix}
              apiPath={this.apiPath}
              locale={this.locale}
              productId={this.productId}
              exportparts={`${carouselParts}, ${productCardParts}`}
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
              isAppended={this.isAppended}
              showInWidget={this.showInWidget}
              recommendationsLoading={this.recommendationsLoading}
              setRecommendationsLoading={this.setRecommendationsLoading}
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
