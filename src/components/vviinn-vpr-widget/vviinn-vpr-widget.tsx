import {
  Component,
  ComponentInterface,
  Host,
  h,
  Prop,
  State,
  Element,
  Watch,
  Event,
  EventEmitter,
  Listen,
  Fragment,
} from "@stencil/core";
import i18next from "i18next";
import { pipe } from "fp-ts/lib/function";
import { Subject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { version } from "../../../package.json";

import { createBearAuthedHeader } from "./token-helpers";
import { globalState, trackEvent, updateGlobalState } from "../../store/store";
import { CampaignName, campaignTypeNames } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { Recommendation } from "../../interfaces/recommendation";
import { SlotSkeleton, slotChangeListener } from "../customized-slots";

import {
  ResultLoadEvent,
  ResultViewEvent,
  WidgetAction,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import {
  ProductCardEvent,
  BasicEventData,
  ProductCardEventData,
  ProductEventType,
  ProductEvent,
  ResultEventType,
  ChangedFiltersEventData,
  TriggerSourceEventData,
} from "../../recommendation/events";
import {
  createWidgetEvent,
  createResultEventByType,
  createProductEventByType,
  createAddToBasketEvent,
  createAddToWishlistEvent,
} from "../../tracking";
import { resources } from "../../locale";
import { Locale } from "../../locale";
import { UpdateIcon } from "../vviinn-icons";
import { getCustomLabels, getRecommendationsBody } from "../../recommendation";
import {
  RequestDynamicFilterItem,
  SimilarProductsResponse,
  ResponseDynamicFilterItem,
} from "../../campaign/VPRCampaignService";
import { CrossSellingResponse } from "../../campaign/VCSCampaignService";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import { RESULTS_CALCULATED_COLUMNS_CSS_VAR } from "../vviinn-carousel/constants";

export type UpdateButtonLocation = "onTop" | "onItem" | "topAndItem";

/**
 * @part product-card - Product Card itself.
 * @part title - Title inside Product Card.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-amount-base-sale - Numeric part of the base price.
 * @part price-amount-base-outdated - Numeric part of the base price.
 * @part price-amount-base-regular - Numeric part of the base price.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part carousel-button - Button for carousel navigation.
 * @part recommendations-results - For internal usage only!
 * @part recommendations-title - Title of the recommendations grid.
 * @part recommendations-subtitle - Subtitle of the recommendations grid.
 * @part basket-button - Add to Basket button.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part update-button-top - Update Button on the top (Set mode).
 * @part update-button-item - Update Button inside the Product Card (Set mode).
 * @part discount-label - Discount label in Product Card (Set mode).
 * @part discount-percentage - Discount percentage inside the Add to Basket button (Set mode).
 *
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 *
 * @slot vviinn-recommendations-title - Recommendations title text.
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Text of Add to Basket icon.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
 *
 * @slot vviinn-recommendations-subtitle - Recommendations subtitle text (Set mode).
 * @slot vviinn-update-button-text - Text of Update Button on the top (Set mode).
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 */

export type Mode = "pure-grid" | CarouselMode;

@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** ID of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Switch between carousel modes */
  @Prop() mode: Mode = "continuity";
  /** Comma-separated list of campaign IDs */
  @Prop() campaigns: string = "";
  /** Excluded filter. Example: "brand:Nike,Vans;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Campaign type */
  @Prop() campaignType: CampaignName = this.mode === "set" ? "VCS" : "VPR";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale;
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** The ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Items amount in set mode grid */
  @Prop() setItemsAmount?: number = 4;
  /** Optional for custom CSS. It will overwrite all other settings */
  @Prop() cssUrl: string | null = null;
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** A custom message is displayed when no results */
  @Prop() noResultText: string = "";
  /** Showing a message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow: boolean = true;
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab: boolean = false;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect: boolean = true;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show filters on top */
  @Prop() showFilters: boolean = false;
  /** Show extended filters on top */
  @Prop() showExtendedFilters: boolean = false;
  /** List of discounts for Set mode. Example: "5, 10, 15, 20" (could be less than 4 numbers) */
  @Prop() setModeDiscounts: string = this.mode === "set" ? "5, 10, 15" : "";
  /** Location of Update button for Set mode */
  @Prop() updateButtonLocation: UpdateButtonLocation = "topAndItem";
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;

  /** Widget’s title */
  @Prop() blockTitle: string;
  /** Show or hide the widget's scrollbar */
  @Prop() showScroll = true;

  /** @internal */
  @Prop() apiPath?: string;
  /** @internal */
  @Prop() useCarousel: boolean = true;
  /** @internal */
  @Prop() showingInButton: boolean = false;
  /** @internal */
  @Prop() buttonElementId?: string;
  /** @internal */
  @Prop() closed?: boolean;
  /** @internal */
  @Prop() opened?: boolean;
  /** @internal */
  @Prop() isAppended?: boolean = false;
  /** @internal */
  @Prop() showInWidget: boolean = false;
  /** @internal */
  @Prop({ mutable: true }) recommendationsLoading?: boolean = false;
  /** @internal */
  @Prop() setRecommendationsLoading?: (loading: boolean) => void;

  @State() recommendations: Recommendation[] = [];
  @State() dynamicFilters: ResponseDynamicFilterItem[] = [];
  @State() sourceProduct: Recommendation | null = null;
  @State() hasErrorOnLoad: boolean = false;
  @State() updatingAllCards: boolean = false;
  @State() updatedCardsAmount: number = 0;
  @State() setModeDiscountsArray: number[] = [];

  /** Event emitted on widget load */
  @Event({ bubbles: true })
  vviinnWidgetLoad: EventEmitter<BasicEventData>;

  /** Recommended product renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Recommended product appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The recommendation result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The recommendation result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Recommendation request failed */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Add to Basket button clicked */
  @Event() vviinnAddToBasket: EventEmitter<BasicEventData>;

  /** The filter's state changes */
  @Event() vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;
  /** @internal */
  @Event() vviinnRecommendationsLoaded: EventEmitter;
  /** @internal */
  @Event({ bubbles: true })
  vviinnWidgetOpen: EventEmitter<BasicEventData>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnWidgetClose: EventEmitter<BasicEventData>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnOneClickDiscoveryClosed: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() sourceProductReceived: EventEmitter<Recommendation>;

  private productIds: string[];
  private productImageLoadedSubject = new Subject();
  private id?: string;
  private resultViewed: boolean = false;
  private isSetMode: boolean;
  private isGridMode: boolean;
  private requestDynamicFilters: RequestDynamicFilterItem[] = [];
  uiSessionId: string;
  private setLoading = (loading: boolean) => {
    this.recommendationsLoading = loading;
    this.setRecommendationsLoading?.(loading);
  };

  private getBasicEventData(): BasicEventData {
    return {
      campaignTypeId: this.campaignType,
      campaignTypeName: campaignTypeNames[this.campaignType],
      widgetVersion: version,
      ...addIfNotEmpty("widgetId", this.id),
    };
  }

  private handleOpenLink(deeplink: string, event: MouseEvent) {
    if (!this.productDetailsRedirect) return;
    if (this.productDetailsNewTab || event.ctrlKey || event.metaKey) {
      let newTab = window.open();
      if (newTab) {
        newTab.location.href = deeplink;
      } else {
        window.location.href = deeplink;
      }
    } else {
      window.location.href = deeplink;
    }
  }

  private findProductById(
    id: Recommendation["productId"],
  ): Recommendation | undefined {
    return this.recommendations.find((r) => r.productId === id);
  }

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  private productCardEventDataToEventBody = (
    eventData: ProductCardEventData,
  ) => {
    const { productRank, productId, campaignTypeId, discount, ...rest } =
      eventData;

    return {
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    };
  };

  @Watch("productId")
  handleProductIdChange() {
    this.getRecommendations();
  }

  @Watch("campaignType")
  handleCampaignTypeChange() {
    this.getRecommendations();
  }

  @Watch("campaigns")
  handleCampaignsChange() {
    this.getRecommendations();
  }

  @Watch("opened")
  trackWidgetOpen() {
    if (!this.opened) return;
    this.vviinnWidgetOpen.emit(this.getBasicEventData());
    this.trackWidgetEvent("open");
  }

  @Watch("closed")
  trackWidgetClose() {
    if (!this.closed) return;
    this.vviinnOneClickDiscoveryClosed.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    this.vviinnWidgetClose.emit(this.getBasicEventData());
    this.trackWidgetEvent("close");
  }

  componentDidRender() {
    if (this.showingInButton && this.closed) return;
    this.replaceSlotsContent();
  }

  connectedCallback() {
    updateGlobalState(this);
    this.id = this.buttonElementId ?? this.el.id;
    this.uiSessionId = uuidv4();
    this.getRecommendations();
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
    this.trackWidgetEvent("load");
    this.isSetMode = this.mode === "set";
    this.isGridMode = this.mode === "grid";
    if (this.isSetMode && this.setModeDiscounts.length) {
      this.setModeDiscountsArray = this.setModeDiscounts
        .split(",")
        .map((d) => parseInt(d.trim()))
        .filter((d) => !isNaN(d));
    }
  }

  async componentWillLoad() {
    await i18next.init({
      lng: globalState.locale,
      fallbackLng: "en",
      resources,
    });

    slotChangeListener(this, this.el);
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    this.productImageLoadedSubject.next(detail.productId);
    const productLoadEvent = this.getProductTrackEvent(detail, "load");
    trackEvent(productLoadEvent);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.resultViewed) {
      this.resultViewed = true;
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");
    if (!productViewEvent) return;

    trackEvent(productViewEvent);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    const productClickEvent = this.getProductTrackEvent(detail, "click");

    await trackEvent(productClickEvent).finally(() => {
      this.handleOpenLink(product.deeplink, clickEvent);
    });
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const product = this.findProductById(productId);

    if (!product || !product.deeplink) return;

    const productClickEvent = this.getProductTrackEvent(detail, "click");

    await trackEvent(productClickEvent);
  }

  @Listen("vviinnAddToBasket")
  async trackAddToBasket({ detail }: ProductCardEvent) {
    const eventBody = this.productCardEventDataToEventBody(detail);

    const addToBasketEvent: WidgetEvent = createAddToBasketEvent(
      detail.campaignTypeId === "VCS" ? "VPC" : detail.campaignTypeId,
    )(eventBody);

    trackEvent(addToBasketEvent);
  }

  @Listen("vviinnAddToFavorite")
  async trackAddToWishlist({ detail }: ProductCardEvent) {
    const eventBody = this.productCardEventDataToEventBody(detail);

    const addToWishlistEvent: WidgetEvent = createAddToWishlistEvent(
      this.campaignType === "VCS" ? "VPC" : "VPR",
    )(eventBody);

    trackEvent(addToWishlistEvent);
  }

  @Listen("vviinnUpdatingAllCardsFinished")
  updatingAllCardsFinishedListener() {
    if (!this.updatingAllCards) return;
    this.updatingAllCards = false;
  }

  @Listen("vviinnFiltersChanged")
  async filtersChanged({ detail }: CustomEvent<ChangedFiltersEventData>) {
    this.requestDynamicFilters = detail.filters;
    this.getRecommendations();
  }

  private trackWidgetEvent(action: WidgetAction) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const eventBody = {
      action,
      session_id: this.uiSessionId,
      ...rest,
    };

    const widgetEvent: WidgetEvent = createWidgetEvent(
      this.campaignType === "VCS" ? "VPC" : "VPR",
    )(eventBody);

    trackEvent(widgetEvent);
  }

  private trackResultEvent(type: ResultEventType) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const eventBody = {
      session_id: this.uiSessionId,
      ...rest,
    };

    const resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultEventByType(
        type,
        this.campaignType === "VCS" ? "VPC" : "VPR",
      )(eventBody);

    trackEvent(resultEvent);
  }

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType,
  ): ProductEvent | null {
    if (!globalState.trackingEnabled) return null;

    const eventBody = this.productCardEventDataToEventBody(detail);

    if (!detail.campaignTypeId) return null;

    const productEvent: ProductEvent = createProductEventByType(
      eventType,
      detail.campaignTypeId === "VCS" ? "VPC" : "VPR",
    )(eventBody);

    return productEvent;
  }

  private async getRecommendations() {
    if (this.productId === undefined || globalState.token === undefined) return;
    this.setLoading(true);
    const campaignType =
      this.campaignType.length > 0 ? this.campaignType : "VPR";

    const headers = createBearAuthedHeader(globalState.token);

    const body = getRecommendationsBody({
      productId: this.productId,
      color: this.color,
      excluded: this.excluded,
      campaigns: this.campaigns,
      dynamicFilters: this.requestDynamicFilters,
    });

    const request = pipe(
      TE.of(getRecommendationsService(campaignType)),
      TE.ap(TE.of(body)),
      TE.ap(TE.of(headers)),
      TE.flatten,
    );

    pipe(
      await request(),
      E.fold(
        (error) => {
          this.handleError(error);
          this.vviinnNoResult.emit(this.getBasicEventData());
          this.vviinnRecommendationsLoaded.emit();
          this.setLoading(false);
        },
        (data) => {
          this.handleRecommendationsSuccess(data);
          this.setLoading(false);
        },
      ),
    );
  }

  private handleError(_: unknown): any {
    this.hasErrorOnLoad = true;
  }

  private handleRecommendationsSuccess({
    data,
    interactions,
  }: SimilarProductsResponse | CrossSellingResponse) {
    this.vviinnResultLoad.emit(this.getBasicEventData());
    this.trackResultEvent("load");
    this.dynamicFilters =
      interactions.dynamicFilters as ResponseDynamicFilterItem[];
    const { products, sourceProduct } = data;
    this.recommendations = products;
    this.sourceProduct = sourceProduct;

    this.sourceProductReceived.emit(sourceProduct);

    this.productIds = this.recommendations.map((r) => r.productId);

    this.productImageLoadedSubject.subscribe((id) => {
      this.productIds = this.productIds.filter((x) => x !== id);

      if (!this.isSetMode && this.productIds.length === 0)
        this.vviinnRecommendationsLoaded.emit();

      if (this.isSetMode) {
        const setModeProductsLoaded =
          this.productIds.length ===
          this.recommendations.length - this.setItemsAmount;

        if (setModeProductsLoaded) this.vviinnRecommendationsLoaded.emit();
      }
    });
  }

  private isExternalCSS(): boolean {
    return this.cssUrl && this.cssUrl.length > 0;
  }

  private renderExternalCSS() {
    return this.isExternalCSS() ? (
      <link href={this.cssUrl} rel="stylesheet" />
    ) : (
      ""
    );
  }

  private renderRecommendation(
    recommendation: Recommendation,
    index: number,
  ): HTMLVviinnProductCardElement {
    return (
      <vviinn-product-card
        currency={globalState.currencySign}
        pricePrefix={globalState.pricePrefix}
        locale={globalState.locale}
        productId={recommendation.productId}
        productTitle={recommendation.title}
        productType={recommendation.productType}
        deeplink={recommendation.deeplink}
        image={recommendation.image.thumbnail}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
        imageRatio={this.imageRatio}
        price={recommendation.price.actual}
        salePrice={recommendation.price.sale}
        basePrice={recommendation.basePrice?.actual}
        baseSalePrice={recommendation.basePrice?.sale}
        energyCertifications={recommendation.energyCertifications}
        addPriceContainer={this.addPriceContainer}
        responsive={this.isGridMode}
        addToBasketShow={this.addToBasketShow}
        campaignTypeId={this.campaignType}
        index={index}
        widgetElementId={this.id}
        widgetVersion={version}
        setMode={this.isSetMode}
        customLabels={getCustomLabels(recommendation)}
        favoriteShow={this.favoriteShow}
      />
    );
  }

  private renderResults() {
    const styleSheet = getComputedStyle(this.el);
    const calculatedColumnsAmount = parseInt(
      styleSheet.getPropertyValue(RESULTS_CALCULATED_COLUMNS_CSS_VAR),
    );
    return (
      <div
        class={`recommendations-results recommendations-${this.mode}`}
        part="recommendations-results"
      >
        {this.recommendationsLoading
          ? Array.from({ length: calculatedColumnsAmount * 3 }).map(
              (_, index) => (
                <vviinn-product-card-skeleton
                  imageRatio={this.imageRatio}
                  key={`skeleton-${index}`}
                />
              ),
            )
          : this.recommendations.map((r, i) => this.renderRecommendation(r, i))}
      </div>
    );
  }

  private renderCarousel(): HTMLVviinnCarouselElement {
    return (
      <vviinn-carousel
        currencySign={globalState.currencySign}
        pricePrefix={globalState.pricePrefix}
        locale={globalState.locale}
        mode={this.mode as CarouselMode}
        campaignTypeId={this.campaignType}
        imageWidth={this.imageWidth}
        showScroll={this.showScroll}
        recommendations={this.recommendations}
        sourceProduct={this.sourceProduct}
        widgetElementId={this.id}
        widgetVersion={version}
        gridArrowsDynamic={this.gridArrowsDynamic}
        addToBasketShow={this.addToBasketShow}
        addPriceContainer={this.addPriceContainer}
        updatingAllCards={this.updatingAllCards}
        updateButtonLocation={this.updateButtonLocation}
        replaceSlotsContent={this.replaceSlotsContent.bind(this)}
        setModeDiscountsArray={this.setModeDiscountsArray}
        imageRatio={this.imageRatio}
        favoriteShow={this.favoriteShow}
        setItemsAmount={this.setItemsAmount}
        loading={this.recommendationsLoading}
        isAppended={this.isAppended}
        hasErrorOnLoad={this.hasErrorOnLoad}
        showInWidget={this.showInWidget}
      ></vviinn-carousel>
    );
  }

  render() {
    if (this.recommendations.length === 0 && this.noResultShow === false)
      return null;
    return (
      <Host
        class={{
          loaded: true,
          empty: this.recommendations.length == 0,
          [this.mode]: true,
        }}
        aria-hidden="false"
      >
        <Fragment>
          {this.renderExternalCSS()}

          {SlotSkeleton("discovery")}

          {(this.isSetMode || this.blockTitle?.length !== 0) && (
            <div class="widget-header">
              <div>
                <h2 part="recommendations-title">
                  <slot name="vviinn-recommendations-title">
                    {this.isSetMode
                      ? i18next.t("setMode.widgetTitle")
                      : this.blockTitle || i18next.t("discoveryWidgetTitle")}
                  </slot>
                </h2>
                {this.isSetMode && (
                  <h3 part="recommendations-subtitle">
                    <slot name="vviinn-recommendations-subtitle">
                      {i18next.t("setMode.widgetSubtitle")}
                    </slot>
                  </h3>
                )}
              </div>

              {this.isSetMode && this.updateButtonLocation !== "onItem" ? (
                <button
                  class="update-button"
                  part="update-button-top"
                  onClick={() => (this.updatingAllCards = true)}
                >
                  <slot name="vviinn-update-button-icon">
                    <UpdateIcon />
                  </slot>
                  <slot name="vviinn-update-button-text">
                    <span>{i18next.t("setMode.updateButtonText")}</span>
                  </slot>
                </button>
              ) : null}
            </div>
          )}

          {(this.showFilters || this.showExtendedFilters) && (
            <div class="filters-header ">
              {this.showFilters && (
                <vviinn-filters filters={this.dynamicFilters}></vviinn-filters>
              )}

              {this.showExtendedFilters && (
                <vviinn-extended-filters
                  filters={this.dynamicFilters}
                ></vviinn-extended-filters>
              )}
            </div>
          )}

          {this.useCarousel ? this.renderCarousel() : this.renderResults()}

          {(this.recommendations.length === 0 ||
            (this.recommendations.length < this.setItemsAmount &&
              this.isSetMode) ||
            this.hasErrorOnLoad) &&
            !this.recommendationsLoading && (
              <div class="no-result-text">
                {this.noResultText.length
                  ? this.noResultText
                  : i18next.t("noResultText")}
              </div>
            )}
        </Fragment>
      </Host>
    );
  }
}
