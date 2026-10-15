import {
  Component,
  Host,
  h,
  Element,
  State,
  Prop,
  Listen,
  Watch,
  Event,
  EventEmitter,
  Fragment,
  forceUpdate,
} from "@stencil/core";
import { chunksOf } from "fp-ts/lib/Array";
import { pipe } from "fp-ts/lib/function";
import i18next from "i18next";

import { Recommendation } from "../../interfaces";
import { ChevronIcon } from "../vviinn-icons";
import { CampaignTypeId, campaignTypeNames } from "../../campaign/Campaign";
import {
  CrossSellingClickEvent,
  ProductCardEvent,
  ProductCardEventData,
} from "../../recommendation/events";
import { UpdateButtonLocation } from "../vviinn-vpr-widget/vviinn-vpr-widget";
import {
  CAROUSEL_COLUMNS_CSS_VAR,
  CAROUSEL_IMAGE_WIDTH_CSS_VAR,
  CAROUSEL_CONTENT_WIDTH_CSS_VAR,
  CONTENT_GROUP_CSS_CLASS,
  DEFAULT_COLUMNS_NUMBER,
  RESULTS_CALCULATED_COLUMNS_CSS_VAR,
  SET_MODE_IMAGE_WIDTH_CSS_VAR,
  SCROLL_POSITION_TOLERANCE,
} from "./constants";
import { calculateDiscount } from "../../utils/number";
import { Locale } from "../../locale";
import { getCustomLabels } from "../../recommendation";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import {
  DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH,
  PRODUCT_CARD_IMAGE_WIDTH,
} from "../../widget/constants";

type MoveDirection = "left" | "right";
export type CarouselMode = "grid" | "continuity" | "set";

/**
 * @part carousel-button - Both carousel navigation buttons (generic part)
 * @part carousel-button-prev - The previous/back navigation button
 * @part carousel-button-next - The next/forward navigation button
 **/
@Component({
  tag: "vviinn-carousel",
  styleUrl: "vviinn-carousel.css",
  shadow: false,
})
export class VviinnCarousel {
  @Element() el: HTMLElement;

  @State() moveDirection: MoveDirection = "right";
  @State() contentGroups: HTMLElement[] = [];
  @State() activeContentGroup: number = 0;
  @State() currentScrollIndex: number = 0;
  @State() isRTL: boolean = false;
  @State() crossSellingRecommendations: Recommendation[] = [];

  @State() setModeDiscount: number | null = null;
  @State() currentDiscountIndex: number = 0;
  @State() setModeAppliedDiscounts: {
    [key: Recommendation["productId"]]: number;
  } = {};
  @State() columns: number = 0;
  @State() showContent: boolean = false;

  @Prop() mode: CarouselMode = "continuity";
  @Prop() currencySign: string;
  @Prop() pricePrefix: string;
  @Prop() locale: Locale;
  @Prop() numberLocale?: string;
  @Prop() imageWidth: number = PRODUCT_CARD_IMAGE_WIDTH;
  @Prop() showScroll: boolean = true;
  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() widgetElementId?: string;
  @Prop() gridArrowsDynamic: boolean;
  @Prop() recommendations: Recommendation[] = [];
  @Prop() sourceProduct: Recommendation;
  @Prop() widgetVersion: string;
  @Prop() addToBasketShow: boolean;
  @Prop() updatingAllCards: boolean;
  @Prop() updateButtonLocation: UpdateButtonLocation;
  @Prop() replaceSlotsContent: () => void;
  @Prop() setModeDiscountsArray: number[];
  @Prop() showMultipleImages: boolean = false;
  @Prop() addPriceContainer?: boolean = false;
  @Prop() favoriteShow: boolean;
  @Prop() setItemsAmount?: number = 4;
  @Prop() isAppended?: boolean = false;
  @Prop() loading?: boolean = false;
  @Prop() hasErrorOnLoad?: boolean = false;
  @Prop() showInWidget: boolean = false;
  @Prop() imageResolutionWidth: number =
    DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH;

  /** Event emitted once when the recommendation is rendered on the page */
  @Event({ bubbles: true })
  vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Event emitted once when the recommendation appears in the viewport */
  @Event({ bubbles: true })
  vviinnProductView: EventEmitter<ProductCardEventData>;
  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this.handleResize();

    if (this.isSetMode && this.updatingAllCards) {
      const currentWidth = this.el.style.getPropertyValue(
        SET_MODE_IMAGE_WIDTH_CSS_VAR,
      );
      if (!currentWidth || currentWidth === "100%") {
        this.setImageWidthSetMode("100%");
      }
    } else {
      this.setImageWidthSetMode("100%");
    }
  });

  private isSetMode: boolean;
  private isGridMode: boolean;
  private isContinuityMode: boolean;
  private defaultAnimationInterval: number = 2000;
  private setModeMaxDiscount: number | null = null;
  private contentGap: number;

  private scrollHandler: EventListener | null = null;
  private scrollEndHandler: EventListener | null = null;

  private getProductData(recommendation, productRank): ProductCardEventData {
    return {
      productId: recommendation.productId,
      productRank,
      productName: recommendation.productTitle,
      productType: recommendation.productType,
      campaignTypeId: this.campaignTypeId,
      campaignTypeName: campaignTypeNames[this.campaignTypeId],
      widgetVersion: this.widgetVersion,
      ...addIfNotEmpty("widgetId", this.widgetElementId),
    };
  }

  private mutationObserver = new MutationObserver(() =>
    this.cloneSlottedContent(),
  );

  private getMaxScrollIndex(): number {
    if (this.isGridMode) {
      return Math.max(
        0,
        Math.ceil(this.recommendations.length / this.columns) - 1,
      );
    }

    const contentNode = this.getContentNode();
    if (!contentNode || contentNode.scrollWidth <= contentNode.clientWidth) {
      return 0;
    }
    const maxScrollLeft = contentNode.scrollWidth - contentNode.clientWidth;
    const step = this.getItemWidth() + this.contentGap;
    return step > 0 ? Math.ceil(maxScrollLeft / step) : 0;
  }

  private isFirst(): boolean {
    return this.currentScrollIndex === 0;
  }

  private isLast(): boolean {
    return this.currentScrollIndex >= this.getMaxScrollIndex();
  }

  private updateCard = (
    productId: string,
    step: number,
    animationInterval: number,
  ) => {
    const clickedProduct = this.crossSellingRecommendations.find(
      (item) => item.productId === productId,
    );
    const crossSellingIndex =
      this.crossSellingRecommendations.indexOf(clickedProduct);
    const recommendationIndex = this.recommendations.indexOf(clickedProduct);
    const newCrossSellingRecommendations = this.crossSellingRecommendations;

    if (recommendationIndex + step < this.recommendations.length) {
      const newRecommendation =
        this.recommendations[recommendationIndex + step];
      newCrossSellingRecommendations[crossSellingIndex] = newRecommendation;

      const productData = this.getProductData(
        newRecommendation,
        recommendationIndex + step,
      );
      if (this.isSetMode) {
        this.vviinnProductLoad.emit(productData);
      }

      const element = this.el.querySelector(`[data-id="${productId}"]`);
      const imageWidth = element.getBoundingClientRect().width;

      this.setImageWidthSetMode(`${imageWidth}px`);

      this.crossSellingRecommendations = [...newCrossSellingRecommendations];

      const button = element.shadowRoot.querySelector(".update-button");
      button?.classList.add("hidden");

      const animationTimer = setTimeout(() => {
        if (recommendationIndex + step * 2 <= this.recommendations.length - 1) {
          button?.classList.remove("hidden");
        }
        if (this.isSetMode) {
          this.vviinnProductView.emit(productData);
        }
        clearTimeout(animationTimer);
      }, animationInterval);
    }
  };

  connectedCallback() {
    this.setItemWidth();

    this.isSetMode = this.mode === "set";
    this.isGridMode = this.mode === "grid";
    this.isContinuityMode = this.mode === "continuity";
  }

  disconnectedCallback() {
    const contentNode = this.getContentNode();
    if (contentNode) {
      if (this.scrollEndHandler) {
        contentNode.removeEventListener("scrollend", this.scrollEndHandler);
      }
      if (this.scrollHandler) {
        contentNode.removeEventListener("scroll", this.scrollHandler);
      }
    }
    this.resizeObserver.disconnect();
  }

  componentDidUpdate() {
    this.replaceSlotsContent();
  }

  componentWillLoad() {
    this.isRTL = document.dir === "rtl";
    this.updateColumnsNumber();

    if (this.isSetMode && this.recommendations?.length > 0) {
      this.recommendationsWatcher();
    }

    if (
      this.recommendations?.length > 0 &&
      !this.showContent &&
      !this.loading
    ) {
      this.showContent = true;
    }
  }

  componentDidLoad() {
    this.setWidth();
    const slot = this.el.querySelector(".content");
    this.mutationObserver.observe(slot, { subtree: true, childList: true });
    this.resizeObserver.observe(this.getHostParent());
    this.updateContentGap();
    const contentNode = this.getContentNode();
    this.scrollEndHandler = () => {
      this.updateCurrentScrollIndex(contentNode);
    };
    contentNode.addEventListener("scrollend", this.scrollEndHandler);
    if (!this.isGridMode) {
      this.scrollHandler = () => {
        this.updateCurrentScrollIndex(contentNode);
      };
      contentNode.addEventListener("scroll", this.scrollHandler);
    }
    // Re-render to recalculate button states with actual DOM dimensions
    forceUpdate(this);
  }

  @Watch("recommendations")
  recommendationsWatcher() {
    if (this.isSetMode) {
      this.setModeDiscount = this.setModeDiscountsArray[0];
      this.setModeMaxDiscount =
        this.setModeDiscountsArray[this.setModeDiscountsArray.length - 1];

      if (this.recommendations.length >= this.columns) {
        this.crossSellingRecommendations = this.recommendations.slice(
          0,
          this.columns,
        );
      } else if (this.recommendations.length > 0) {
        this.crossSellingRecommendations = [...this.recommendations];
      }
    }
  }

  @Watch("updatingAllCards")
  updatingAllCardsWatcher() {
    if (!this.updatingAllCards) return;

    this.crossSellingRecommendations.forEach((item) => {
      this.updateCard(
        item.productId,
        this.columns,
        this.defaultAnimationInterval,
      );
    });
  }

  @Watch("loading")
  onLoadingChange(newValue: boolean) {
    if (!newValue) {
      setTimeout(() => {
        this.showContent = true;
      }, 200);
    } else {
      this.showContent = false;
    }
  }

  @Listen("vviinnCrossSellingClick")
  crossSellingClickListener({ detail }: CrossSellingClickEvent) {
    const { animationInterval, productData } = detail;
    this.updateCard(productData.productId, this.columns, animationInterval);
  }

  private getItemWidthFromDocument(): number {
    return parseInt(
      getComputedStyle(document.body).getPropertyValue(
        CAROUSEL_IMAGE_WIDTH_CSS_VAR,
      ),
    );
  }

  @Listen("vviinnAddToBasket")
  async setModeAddToBasketHandler({ detail }: ProductCardEvent) {
    if (!this.isSetMode) return;

    const { productId } = detail;
    if (
      Object.prototype.hasOwnProperty.call(
        this.setModeAppliedDiscounts,
        productId,
      )
    )
      return;

    this.setModeAppliedDiscounts = {
      ...this.setModeAppliedDiscounts,
      [productId]: this.setModeDiscount,
    };

    const isMaxDiscount = this.setModeDiscount === this.setModeMaxDiscount;
    if (!isMaxDiscount) {
      this.currentDiscountIndex += 1;
      this.setModeDiscount =
        this.setModeDiscountsArray[this.currentDiscountIndex];
    }
  }

  private setItemWidth() {
    const widthInDocument = this.getItemWidthFromDocument();
    const itemWidth = isNaN(widthInDocument)
      ? this.imageWidth
      : widthInDocument;

    this.el.style.setProperty(CAROUSEL_IMAGE_WIDTH_CSS_VAR, `${itemWidth}px`);
  }

  private setImageWidthSetMode(width: string) {
    this.el.style.setProperty(SET_MODE_IMAGE_WIDTH_CSS_VAR, width);
  }

  private getContentClassMap() {
    return {
      content: true,
      [this.moveDirection]: true,
      [this.mode]: true,
      "show-scrollbar": this.isSetMode ? false : this.showScroll,
    };
  }

  private getBodyClassMap() {
    return {
      body: true,
      "append-slider": this.isAppended,
      "empty-results": this.isEmptyResults(),
    };
  }

  private handleResize() {
    this.updateColumnsNumber();
    this.setWidth();
    this.setItemWidth();
    this.updateContentGap();
  }

  private getItemWidth(): number {
    const contentNode = this.getContentNode();
    const firstItem = contentNode?.children?.[0] as HTMLElement;
    if (firstItem) {
      return firstItem.getBoundingClientRect().width;
    }
    return this.imageWidth;
  }

  private calculateMoveStep() {
    if (this.isGridMode) {
      const imageGroups = this.getContent().filter(
        (el) => !el.matches("button"),
      );
      const contentWidths = imageGroups.map(
        (el) => el.getBoundingClientRect().width,
      );
      const sum = contentWidths.reduce((acc, val) => acc + val, 0);
      return sum / contentWidths.length + this.contentGap;
    }
    return this.getItemWidth() + this.contentGap;
  }

  private getHostParent(): Element {
    const parent = this.el.parentNode as any;
    return parent.host.parentElement;
  }

  private setWidth() {
    const parent = this.getHostParent();
    if (!parent) return;

    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width =
      parentWidth -
      (parseInt(parentStyles["padding-right"]) +
        parseInt(parentStyles["padding-left"]));

    this.el.style.setProperty(CAROUSEL_CONTENT_WIDTH_CSS_VAR, `${width}px`);
  }

  private cloneSlottedContent() {
    this.setWidth();
  }

  private getContentNode(): HTMLElement {
    return this.el.querySelector(".content");
  }

  private getContent(): HTMLElement[] {
    const children = this.getContentNode().children;
    return Array.from(children).map((c) => c as HTMLElement);
  }

  private updateContentGap(): void {
    this.contentGap = pipe(
      window.getComputedStyle(this.getContentNode()),
      (computedStyle) => computedStyle.getPropertyValue("gap"),
      (contentGapString) => parseInt(contentGapString.split("px")[0]),
      (contentGap) => (isNaN(contentGap) ? 0 : contentGap),
    );
  }

  private updateColumnsNumber(): number {
    if (this.isSetMode) {
      this.columns = this.setItemsAmount;
      return;
    }

    const styleSheet = getComputedStyle(this.el);
    const calculatedColumnsAmount = parseInt(
      styleSheet.getPropertyValue(RESULTS_CALCULATED_COLUMNS_CSS_VAR),
    );
    if (!calculatedColumnsAmount || isNaN(calculatedColumnsAmount)) {
      const cssColumnsAmount = parseInt(
        styleSheet.getPropertyValue(CAROUSEL_COLUMNS_CSS_VAR),
      );
      this.columns =
        cssColumnsAmount >= 1 ? cssColumnsAmount : DEFAULT_COLUMNS_NUMBER;
    } else {
      this.columns = calculatedColumnsAmount;
    }
  }

  private handleCarouselButtonClick(action: MoveDirection) {
    this.moveDirection = action;
    const contentContainer = this.getContentNode();
    const step = this.calculateMoveStep();
    let newIndex = this.currentScrollIndex + (action === "right" ? 1 : -1);
    newIndex = Math.max(0, Math.min(this.getMaxScrollIndex(), newIndex));
    this.currentScrollIndex = newIndex;

    if (this.isContinuityMode) {
      const maxScrollLeft =
        contentContainer.scrollWidth - contentContainer.clientWidth;
      let targetScrollLeft = step * newIndex;
      if (
        action === "right" &&
        targetScrollLeft > maxScrollLeft - SCROLL_POSITION_TOLERANCE
      ) {
        targetScrollLeft = maxScrollLeft;
      }
      requestAnimationFrame(() => {
        contentContainer.scrollTo({
          top: 0,
          left: targetScrollLeft,
          behavior: "smooth",
        });
      });
      return;
    }
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: step * newIndex,
        behavior: "smooth",
      });
    });
  }

  private scroll(index: number) {
    const contentContainer = this.getContentNode();
    this.currentScrollIndex = index;
    requestAnimationFrame(() => {
      contentContainer.scrollTo({
        top: 0,
        left: this.calculateMoveStep() * index,
        behavior: "smooth",
      });
    });
  }

  private showBullets(): boolean {
    return !this.loading && this.isGridMode && this.showScroll;
  }

  private showScrollbar(): boolean {
    return !this.loading && this.isContinuityMode && this.showScroll;
  }

  private showArrowButtons(): boolean {
    return (
      this.showContent && !!this.recommendations?.length && !this.isSetMode
    );
  }

  private getClassMap() {
    return {
      [this.mode]: true,
      "show-scrollbar": this.showScrollbar(),
    };
  }

  private renderRecommendation(
    recommendation: Recommendation,
    rank: number,
  ): HTMLVviinnProductCardElement {
    const appliedDiscount =
      this.setModeAppliedDiscounts[recommendation.productId];

    const setModeDiscount = calculateDiscount(
      recommendation.price?.actual,
      appliedDiscount ?? this.setModeDiscount,
    );

    const salePrice = this.isSetMode
      ? setModeDiscount
      : recommendation.price.sale;

    return (
      <vviinn-product-card
        index={rank}
        productId={recommendation.productId}
        product={recommendation}
        productTitle={recommendation.title}
        productType={recommendation.productType}
        entityType={recommendation.entityType}
        deeplink={recommendation.deeplink}
        image={
          recommendation.image?.thumbnail ?? recommendation.image?.original
        }
        images={recommendation.images}
        showMultipleImages={this.showMultipleImages}
        disableMobileSwiper={true}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
        imageResolutionWidth={this.imageResolutionWidth}
        price={recommendation.price.actual}
        salePrice={salePrice}
        basePrice={recommendation.basePrice?.actual}
        baseSalePrice={recommendation.basePrice?.sale}
        responsive={this.isGridMode || this.isSetMode}
        campaignTypeId={this.campaignTypeId}
        widgetElementId={this.widgetElementId}
        widgetVersion={this.widgetVersion}
        addToBasketShow={this.addToBasketShow}
        data-id={recommendation.productId}
        energyCertifications={recommendation.energyCertifications}
        updatingAllCards={this.updatingAllCards}
        defaultAnimationInterval={this.defaultAnimationInterval}
        updateButtonLocation={this.updateButtonLocation}
        appliedDiscountPercentage={appliedDiscount}
        currentDiscountPercentage={this.setModeDiscount}
        currencySign={this.currencySign}
        pricePrefix={this.pricePrefix}
        locale={this.locale}
        numberLocale={this.numberLocale}
        isSetMode={this.isSetMode}
        customLabels={getCustomLabels(recommendation)}
        addPriceContainer={this.addPriceContainer}
        favoriteShow={this.favoriteShow}
      />
    );
  }

  private renderRecommendations() {
    return this.isGridMode
      ? this.renderGrid()
      : this.renderRecommendationsElements();
  }

  private renderGrid() {
    return this.loading || !this.showContent
      ? this.renderSkeletonContainer()
      : this.renderSliderContent();
  }

  private renderRecommendationsElements(): HTMLVviinnProductCardElement[] {
    const recommendations = this.isSetMode
      ? this.crossSellingRecommendations
      : this.recommendations;
    return recommendations.map((r, i) => this.renderRecommendation(r, i));
  }

  private renderSkeletonContainer() {
    return (
      <div
        part={CONTENT_GROUP_CSS_CLASS}
        class={{
          [CONTENT_GROUP_CSS_CLASS]: true,
        }}
      >
        {Array.from({ length: this.columns }).map((_, index) => (
          <vviinn-product-card
            loading={true}
            responsive={true}
            productTitle=""
            productId={`skeleton-${index}`}
            key={`skeleton-${index}`}
          />
        ))}
      </div>
    );
  }

  private renderSliderContent() {
    const recommendations = this.renderRecommendationsElements();
    const grouppedContent = chunksOf(this.columns)(recommendations);
    return this.renderRecommendationGroups(grouppedContent);
  }

  private renderRecommendationGroups = (
    elements: HTMLVviinnProductCardElement[][],
  ) =>
    elements.map((element) => (
      <div class={CONTENT_GROUP_CSS_CLASS} part={CONTENT_GROUP_CSS_CLASS}>
        {element}
      </div>
    ));

  private renderBullets() {
    const numberOfBullets = Math.ceil(
      this.recommendations.length / this.columns,
    );
    const bulletsArray = Array.from(Array(numberOfBullets).keys());
    return bulletsArray.map((index) => (
      <div
        class={{
          bullet: true,
          active: this.currentScrollIndex === index,
        }}
        onClick={() => this.scroll(index)}
      />
    ));
  }

  private isEmptyResults() {
    return (
      this.hasErrorOnLoad ||
      (this.recommendations.length === 0 && !this.loading)
    );
  }

  private updateCurrentScrollIndex(contentNode: HTMLElement) {
    if (!contentNode) return;
    let scrollIndex: number;
    if (this.isGridMode) {
      const step = this.calculateMoveStep();
      scrollIndex = Math.round(contentNode.scrollLeft / step);
    } else {
      const maxScrollLeft = contentNode.scrollWidth - contentNode.clientWidth;
      if (maxScrollLeft - contentNode.scrollLeft < SCROLL_POSITION_TOLERANCE) {
        scrollIndex = this.getMaxScrollIndex();
      } else {
        const step = this.getItemWidth() + this.contentGap;
        scrollIndex = Math.round(contentNode.scrollLeft / step);
      }
    }
    this.currentScrollIndex = Math.max(
      0,
      Math.min(this.getMaxScrollIndex(), scrollIndex),
    );
  }

  render() {
    return (
      <Host class={this.getClassMap()}>
        <div class={{ ...this.getClassMap(), ...this.getBodyClassMap() }}>
          {this.isSetMode && this.crossSellingRecommendations.length > 0 && (
            <vviinn-product-card
              class="set-mode product-card--source"
              productTitle={this.sourceProduct.title}
              image={
                this.sourceProduct.image?.thumbnail ??
                this.sourceProduct.image?.original
              }
              images={this.sourceProduct.images}
              showMultipleImages={this.showMultipleImages}
              disableMobileSwiper={true}
              entityType={this.sourceProduct.entityType}
              price={this.sourceProduct.price.actual}
              salePrice={this.sourceProduct.price.sale}
              basePrice={this.sourceProduct.basePrice?.actual}
              baseSalePrice={this.sourceProduct.basePrice?.sale}
              addPriceContainer={this.addPriceContainer}
              imageWidth={300}
              imageResolutionWidth={this.imageResolutionWidth}
              isSourceProduct={true}
              currencySign={this.currencySign}
              pricePrefix={this.pricePrefix}
              isSetMode={this.isSetMode}
              locale={this.locale}
              numberLocale={this.numberLocale}
              favoriteShow={this.favoriteShow}
              customLabels={getCustomLabels(this.sourceProduct)}
              responsive={true}
            />
          )}

          <div class={this.getContentClassMap()}>
            {this.renderRecommendations()}

            {this.showArrowButtons() && (
              <Fragment>
                <button
                  class={{
                    prev: true,
                    "grid-arrows-dynamic":
                      this.gridArrowsDynamic && this.isGridMode,
                  }}
                  onClick={() => this.handleCarouselButtonClick("left")}
                  part="carousel-button carousel-button-prev"
                  disabled={this.isFirst()}
                  aria-label={i18next.t("buttons.previous")}
                >
                  <ChevronIcon />
                </button>

                <button
                  class="next"
                  onClick={() => this.handleCarouselButtonClick("right")}
                  part="carousel-button carousel-button-next"
                  disabled={this.isLast()}
                  aria-label={i18next.t("buttons.next")}
                >
                  <ChevronIcon />
                </button>
              </Fragment>
            )}
          </div>
        </div>
        {this.showBullets() && (
          <div class="bullets">{this.renderBullets()}</div>
        )}
      </Host>
    );
  }
}
