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
import { trackEvent } from "../../store/store";
import { isTrackingEnabled } from "../../store/tracking";
import { CampaignName, campaignTypeNames } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { Recommendation } from "../../interfaces";
import { SlotSkeleton, slotChangeListener } from "../customized-slots";

import {
  ResultLoadEvent,
  ResultViewEvent,
  WidgetAction,
  WidgetEvent,
  AddToBasketEvent,
  AddToWishlistEvent,
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
import { createQueryContext } from "../../tracking/queryContext";
import { Locale, initializeLocale } from "../../locale";
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
import {
  DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH,
  PRODUCT_CARD_IMAGE_WIDTH,
} from "../../widget/constants";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
import { openProductLink } from "../../helpers/navigation/openProductLink";

export type UpdateButtonLocation = "onTop" | "onItem" | "topAndItem";

export type Mode = "pure-grid" | CarouselMode;

/**
 * @part product-card - Product Card itself.
 * @part title - Title inside Product Card.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
 * @part image-placeholder - Placeholder shown when no image is available.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
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
 * @part product-card-actions - Product Card actions wrapper.
 * @part product-card-actions-top - Product Card top actions wrapper.
 * @part carousel-button - Both carousel navigation buttons (generic part).
 * @part carousel-button-prev - The previous/back carousel navigation button.
 * @part carousel-button-next - The next/forward carousel navigation button.
 * @part recommendations-results - For internal usage only!
 * @part recommendations-title - Title of the recommendations grid.
 * @part recommendations-subtitle - Subtitle of the recommendations grid.
 * @part basket-button - Add to Basket button.
 * @part favorite-button - Favorite button.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part update-button-top - Update Button on the top (Set mode).
 * @part update-button-item - Update Button inside the Product Card (Set mode).
 * @part discount-label - Discount label in Product Card (Set mode).
 * @part discount-percentage - Discount percentage inside the Add to Basket button (Set mode).
 * @part product-images-pagination - Container for product images pagination dots (mobile only).
 * @part product-images-pagination-bullet - Individual pagination dot.
 * @part product-images-pagination-bullet-active - Active pagination dot.
 * @part list-card - List card container.
 * @part list-card-content-container - List card's content container.
 * @part list-card-image-container - List card's image container.
 * @part list-label - List card's label (e.g., "Category").
 * @part list-title - List card's title.
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
 * @slot vviinn-recommendations-subtitle - Recommendations subtitle text.
 * @slot vviinn-update-button-text - Text of Update Button on the top (Set mode).
 * @slot vviinn-update-button-icon - Icon of Update Button (Set mode).
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-image-placeholder-icon - Icon or content for the image placeholder.
 */
@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;
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
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Locale for number formatting. Falls back to locale */
  @Prop() numberLocale?: string;
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Width of each recommended product image in Continuity mode */
  @Prop() imageWidth: number = PRODUCT_CARD_IMAGE_WIDTH;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth: number =
    DISCOVERY_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Show multiple images on hover (desktop only) */
  @Prop() showMultipleImages: boolean = false;
  /** Items amount in set mode grid */
  @Prop() setItemsAmount?: number = 4;
  /** URL to external CSS file for custom styling */
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

  /** Widget's title */
  @Prop() blockTitle: string;
  /** Widget's subtitle */
  @Prop() blockSubtitle: string;
  /** Show or hide the widget's scrollbar */
  @Prop() showScroll = true;

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
  /** @internal */
  @Prop({ mutable: true }) uiSessionId?: string;

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

  /** Click on the product's link */
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
  vviinnOneClickDiscoveryAppendClosed: EventEmitter<TriggerSourceEventData>;
  /** @internal */
  @Event() sourceProductReceived: EventEmitter<Recommendation>;

  private productIds: string[];
  private productImageLoadedSubject = new Subject();
  private id?: string;
  private resultViewed: boolean = false;
  private isSetMode: boolean;
  private isGridMode: boolean;
  private requestDynamicFilters: RequestDynamicFilterItem[] = [];
  private trackingCampaignType: "VPR" | "VPC";
  private setLoading = (loading: boolean) => {
    this.recommendationsLoading = loading;
    this.setRecommendationsLoading?.(loading);
  };

  private trackIfNotAppended(
    trackingFn: () => void | Promise<void>,
  ): void | Promise<void> {
    if (this.isAppended) return;
    return trackingFn();
  }

  private trackProductEventIfNotAppended(
    detail: ProductCardEventData,
    eventType: ProductEventType | "basket" | "wishlist",
  ): void {
    this.trackIfNotAppended(() => {
      const productEvent = this.getProductTrackEvent(detail, eventType);
      productEvent && trackEvent(productEvent, this.token, this.apiPath);
    });
  }

  private getTrackingCampaignType(): "VPR" | "VPC" {
    return this.campaignType === "VCS" ? "VPC" : "VPR";
  }

  private showNoResultText = () =>
    !this.recommendationsLoading &&
    (this.recommendations.length === 0 || this.hasErrorOnLoad);

  private getBasicEventData(): BasicEventData {
    return {
      campaignTypeId: this.campaignType,
      campaignTypeName: campaignTypeNames[this.campaignType],
      widgetVersion: version,
      ...addIfNotEmpty("widgetId", this.id),
    };
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
      ...this.getQueryContext(),
    };
  };

  private getQueryContext = () =>
    createQueryContext({ sourceProductId: this.productId });

  @Watch("productId")
  handleProductIdChange() {
    this.getRecommendations();
  }

  @Watch("campaignType")
  handleCampaignTypeChange() {
    this.trackingCampaignType = this.getTrackingCampaignType();
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
    this.vviinnOneClickDiscoveryAppendClosed.emit({
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
    this.id = this.buttonElementId ?? this.el.id;
    if (!this.uiSessionId) {
      this.uiSessionId = uuidv4();
    }

    this.trackingCampaignType = this.getTrackingCampaignType();
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
    await initializeLocale(this.locale);

    slotChangeListener(this, this.el);
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    this.productImageLoadedSubject.next(detail.productId);
    this.trackProductEventIfNotAppended(detail, "load");
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.resultViewed) {
      this.resultViewed = true;
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
    }
    this.trackProductEventIfNotAppended(detail, "view");
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    await this.trackIfNotAppended(async () => {
      const productClickEvent = this.getProductTrackEvent(detail, "click");

      await trackEvent(productClickEvent, this.token, this.apiPath).finally(
        () => {
          openProductLink(
            product.deeplink,
            clickEvent,
            this.productDetailsRedirect,
            this.productDetailsNewTab,
          );
        },
      );
    });

    if (this.isAppended) {
      openProductLink(
        product.deeplink,
        clickEvent,
        this.productDetailsRedirect,
        this.productDetailsNewTab,
      );
    }
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;
    this.trackProductEventIfNotAppended(detail, "click");
  }

  @Listen("vviinnAddToBasket")
  async trackAddToBasket({ detail }: ProductCardEvent) {
    this.trackProductEventIfNotAppended(detail, "basket");
  }

  @Listen("vviinnAddToFavorite")
  async trackAddToWishlist({ detail }: ProductCardEvent) {
    this.trackProductEventIfNotAppended(detail, "wishlist");
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
      this.trackingCampaignType,
    )(eventBody);
    trackEvent(widgetEvent, this.token, this.apiPath);
  }

  private trackResultEvent(type: ResultEventType) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const eventBody = {
      session_id: this.uiSessionId,
      ...rest,
      ...this.getQueryContext(),
    };

    const resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultEventByType(type, this.trackingCampaignType)(eventBody);
    trackEvent(resultEvent, this.token, this.apiPath);
  }

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType | "basket" | "wishlist",
  ): ProductEvent | AddToBasketEvent | AddToWishlistEvent | null {
    if (!isTrackingEnabled()) return null;

    if (eventType === "basket") {
      delete detail.discount;
    }

    const eventBody = this.productCardEventDataToEventBody(detail);

    if (!detail.campaignTypeId) return null;

    const campaignType = this.trackingCampaignType;

    if (eventType === "basket" || eventType === "wishlist") {
      const eventCreator =
        eventType === "basket"
          ? createAddToBasketEvent
          : createAddToWishlistEvent;
      return eventCreator(campaignType)(eventBody);
    } else {
      return createProductEventByType(eventType, campaignType)(eventBody);
    }
  }

  private async getRecommendations() {
    if (this.productId === undefined || this.token === undefined) return;
    this.setLoading(true);
    const campaignType =
      this.campaignType.length > 0 ? this.campaignType : "VPR";

    const headers = createBearAuthedHeader(this.token);

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
      TE.ap(TE.of(this.apiPath)),
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
          this.vviinnRecommendationsLoaded.emit();
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

  private renderRecommendation(
    recommendation: Recommendation,
    index: number,
  ): HTMLVviinnProductCardElement {
    return (
      <vviinn-product-card
        currencySign={this.currencySign}
        pricePrefix={this.pricePrefix}
        locale={this.locale}
        numberLocale={this.numberLocale}
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
        imageResolutionWidth={this.imageResolutionWidth}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
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
        isSetMode={this.isSetMode}
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
    const isLoading = this.recommendationsLoading;

    return (
      <div
        class={`recommendations-results recommendations-${this.mode}`}
        part="recommendations-results"
        aria-busy={isLoading ? "true" : "false"}
        aria-live={isLoading ? "polite" : "off"}
      >
        {isLoading
          ? Array.from({ length: calculatedColumnsAmount * 3 }).map(
              (_, index) => (
                <vviinn-product-card
                  loading={true}
                  responsive={true}
                  productTitle=""
                  productId={`skeleton-${index}`}
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
        currencySign={this.currencySign}
        pricePrefix={this.pricePrefix}
        locale={this.locale}
        numberLocale={this.numberLocale}
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
        imageResolutionWidth={this.imageResolutionWidth}
        showMultipleImages={this.showMultipleImages}
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
    const isLoading = this.recommendationsLoading;

    return (
      <Host
        class={{
          loaded: true,
          empty: this.recommendations.length == 0,
          [this.mode]: true,
          "show-in-widget": this.showInWidget,
        }}
        role="region"
        aria-label={
          !this.showingInButton ? i18next.t("a11y.recommendations") : undefined
        }
        aria-busy={isLoading ? "true" : "false"}
        aria-live={isLoading ? "polite" : "off"}
      >
        <Fragment>
          {renderExternalCSS(this.cssUrl)}

          {SlotSkeleton("discovery")}

          {(this.isSetMode ||
            this.blockTitle !== "" ||
            !!this.blockSubtitle) && (
            <div class="widget-header">
              <div>
                {this.blockTitle !== "" && (
                  <h2 part="recommendations-title">
                    <slot name="vviinn-recommendations-title">
                      {this.blockTitle ??
                        (this.isSetMode
                          ? i18next.t("setMode.widgetTitle")
                          : i18next.t("discoveryWidgetTitle"))}
                    </slot>
                  </h2>
                )}
                {(this.isSetMode || !!this.blockSubtitle) && (
                  <h3 part="recommendations-subtitle">
                    <slot name="vviinn-recommendations-subtitle">
                      {this.blockSubtitle ||
                        (this.isSetMode
                          ? i18next.t("setMode.widgetSubtitle")
                          : "")}
                    </slot>
                  </h3>
                )}
              </div>

              {this.isSetMode &&
              this.updateButtonLocation !== "onItem" &&
              this.recommendations.length > 0 ? (
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
              {this.showFilters && <vviinn-filters></vviinn-filters>}

              {this.showExtendedFilters && (
                <vviinn-extended-filters
                  showingInButton={this.showingInButton}
                  locale={this.locale}
                  currencySign={this.currencySign}
                ></vviinn-extended-filters>
              )}
            </div>
          )}

          {this.useCarousel ? this.renderCarousel() : this.renderResults()}

          {this.showNoResultText() && (
            <div class="no-result-text" role="status">
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
