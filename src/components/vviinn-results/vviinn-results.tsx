import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen,
  State,
  Watch,
} from "@stencil/core";
import * as E from "fp-ts/Either";
import i18next from "i18next";
import { pipe } from "fp-ts/lib/function";
import {
  AddToBasketEvent,
  FilterEvent,
  ResultLoadEvent,
  ResultViewEvent,
  Widget,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import { version } from "../../../package.json";
import {
  makeProductListingPageRequest,
  makeVisualSearchRequest,
  makeTextSearchRequest,
  setTextSearchQuery,
  SearchStore,
  SearchStoreName,
  resetResultEvents,
  resetStore,
  useSearchStore,
} from "../../store/search.store";
import { trackEvent } from "../../store/store";
import { isTrackingEnabled } from "../../store/tracking";
import {
  BasicEventData,
  ImageUploadEventData,
  Locale,
  Recommendation,
} from "../../components";
import { ErrorType } from "../vviinn-error";
import { campaignTypeNames } from "../../campaign/Campaign";
import { TextSearchResponse } from "../../interfaces";
import {
  ChangedFiltersEvent,
  DynamicFilterInternalData,
  ProductCardEvent,
  ProductCardEventData,
  ProductEvent,
  ProductEventType,
  ResultEventType,
  TextSearchEvent,
  TriggerSourceEvent,
  TriggerSourceEventData,
} from "../../recommendation/events";
import {
  createFilterEvent,
  createProductEventByType,
  createResultEventByType,
  createAddToBasketEvent,
  createWidgetEvent,
  createAddToWishlistEvent,
} from "../../tracking";
import { getUiSessionId } from "../../tracking/session";
import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import { initializeLocale } from "../../locale";
import {
  productCardSlotNames,
  slotChangeListener,
  vprIconSlotName,
} from "../customized-slots";
import { getCustomLabels } from "../../recommendation";
import {
  parseResultsPageParams,
  parseResultsPageParamNames,
  isOnResultsPage,
} from "../../helpers/url/resultsPageUrl";
import {
  productCardParts,
  productCardsGridPart,
  showMoreButtonPart,
  listCardParts,
  contentCardParts,
} from "../../cssParts";
import {
  findSlotElements,
  getSlotNames,
  addEventListenersWithSignal,
} from "../../dom";
import {
  LoadMoreMode,
  OneClickDiscoveryMode,
  oneClickDiscoveryModes,
} from "../../widget/types";
import {
  RESULTS_WIDGET_IMAGE_RESOLUTION_WIDTH,
  SCROLL_TO_DISCOVERY_DELAY,
} from "../../widget/constants";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import { RESULTS_CALCULATED_COLUMNS_CSS_VAR } from "../vviinn-carousel/constants";
import { renderExternalCSS } from "../../utils/cssUrl/cssUrlHelper";
import { openProductLink } from "../../helpers/navigation/openProductLink";
import { extractSelectedFilters } from "../vviinn-filters/helpers/extractSelectedFilters";

export type ReplaceSlotsContentInParent = (
  childrenElement?: HTMLElement,
) => void;

/**
 * @part products - Products container.
 * @part product-card - Product Card itself.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
 * @part image-placeholder - Placeholder shown when no image is available.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-base-sale - Numeric part of the base price.
 * @part price-amount-base-outdated - Numeric part of the base price.
 * @part price-amount-base-regular - Numeric part of the base price.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part title - Title inside Product Card.
 * @part basket-button - Add to Basket button.
 * @part basket-button-container - Product Card's basket button container.
 * @part favorite-button - Favorite button.
 * @part product-card-actions - Product Card actions wrapper.
 * @part product-card-actions-top - Product Card top actions wrapper.
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 * @part product-images-pagination - Container for product images pagination dots (mobile only).
 * @part product-images-pagination-bullet - Individual pagination dot.
 * @part product-images-pagination-bullet-active - Active pagination dot.
 *
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 *
 * @part list-card - List card container (for entity-type="list").
 * @part list-card-content-container - List card's content container.
 * @part list-label - List card's label (e.g., "Category").
 * @part list-title - List card's title.
 * @part list-card-image-container - List card's image container.
 * @part list-card-image - List card's image element.
 * @part list-card-image-picture - List card's image picture element.
 *
 * @part content-card - Content card container (for entity-type="content").
 * @part content-card-content-container - Content card's content container.
 * @part content-label - Content card's label.
 * @part content-title - Content card's title.
 * @part content-link - Content card's link.
 * @part content-card-image - Content card's image element.
 * @part content-card-image-container - Content card's image container.
 * @part content-card-image-picture - Content card's image picture element.
 *
 * @part show-more-button - Button that loads the next results. Rendered only if `load-more` is `button`.
 *
 * @slot vviinn-results-vpr-icon - One-Click Discovery icon, hidden when `one-click-discovery-mode` is `unset`.
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Icon of Add to Basket button.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-image-placeholder-icon - Icon or content for the image placeholder.
 */
@Component({
  tag: "vviinn-results",
  styleUrl: "vviinn-results.css",
  shadow: true,
})
export class VviinnResults {
  @Element() el: HTMLElement;

  /** Recommended product renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Recommended product appears in the viewport */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;
  /** Click on the product's link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;
  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Cropper state should be resetted */
  /** @internal */
  @Event() vviinnCropperResetState: EventEmitter<TriggerSourceEventData>;

  /** Triggered when a text search request fails */
  @Event() vviinnNoResult: EventEmitter<BasicEventData>;

  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** Locale for text localization */
  @Prop() locale?: Locale;
  /** Locale for number formatting. Falls back to locale */
  @Prop() numberLocale?: string;
  /** Campaign ID used for Text Search */
  @Prop() campaignIdTextSearch: string = "";
  /** Campaign ID used for Visual Search */
  @Prop() campaignIdVisualSearch: string = "";
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** Search ID for results request */
  @Prop() searchId?: string;
  /** URL of the results page. When set, the component parses URL parameters (query, searchId) on load. */
  @Prop() resultsPageUrl?: string;
  /** Custom URL param names parsed from results page URL. Default: "query=query&searchId=searchId". */
  @Prop() resultsPageParams?: string;
  /** uiSessionId from vps-widget */
  /** @internal */
  @Prop({ mutable: true }) uiSessionId?: string;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth?: number = RESULTS_WIDGET_IMAGE_RESOLUTION_WIDTH;
  /** Show multiple images: swiper on mobile, hover on desktop in product cards */
  @Prop() showMultipleImages: boolean = false;
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab?: boolean = false;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect?: boolean = true;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** Query to perform a text search. It is recommended to use the search-query prop for vviinn-text-search instead, when using the Search Bar on the same page. */
  @Prop() textSearchQuery?: string;
  /** Column for performing Product Listing Page request */
  @Prop() filterColumn?: string = "product_type";
  /** Value for performing Product Listing Page request */
  @Prop() filterValue?: string;
  /** Number of results displayed for text search and product listing page (less or equal to the value, set in the campaign) */
  @Prop() resultsCount?: number;
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;
  /**
   * Load the next results: `button` shows a button below the results.
   * @since 2.230.0
   */
  @Prop() loadMore: LoadMoreMode = "none";

  /** One-Click Discovery Mode */
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryMode = "append-grid";
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";
  /** URL to external CSS file for custom styling */
  @Prop() cssUrl: string | null = null;
  /** API endpoint URL (optional, defaults to production) */
  @Prop() apiPath?: string;

  /** True when we use vviinn-results inside the widget */
  /** @internal */
  @Prop() showInWidget?: boolean = false;
  /** Element Id, passed from vps-button */
  /** @internal */
  @Prop() buttonElementId?: string;
  /** Element Id, passed from vps-widget */
  /** @internal */
  @Prop({ mutable: true }) widgetElementId?: string;
  /** @internal */
  @Prop() showAspectRatioError?: boolean;
  /** @internal */
  @Prop() resetWidgetState?: () => void;
  /** @internal */
  @Prop() replaceSlotsContentInWidget?: ReplaceSlotsContentInParent;
  /** @internal */
  @Prop() replaceSlotsContentInButton?: ReplaceSlotsContentInParent;
  /** @internal */
  @Prop() parentSlots?: HTMLSlotElement[] = [];
  /** Works for product-listing-page request */
  /** @internal */
  @Prop() useInnerState?: boolean = false;
  /** @internal */
  @Prop() scrollableModalBody?: HTMLElement;

  @State() slotsReplaced: boolean;
  @State() oneClickDiscoveryAppendIndex: number;
  @State() oneClickDiscoverySelectedIndex: number;
  @State() innerResults: Recommendation[] = [];

  private passedSlotNames?: string[] = [];
  private slots?: HTMLSlotElement[] = [];
  private state?: SearchStore;
  private storeName?: SearchStoreName;
  private disposeStoreListener?: () => void;
  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this.calculateColumns();
    this.calculateCardHeight();
  });

  private updateCampaignIds = () => {
    this.state.campaignIdTextSearch = this.campaignIdTextSearch;
    this.state.campaignIdVisualSearch = this.campaignIdVisualSearch;
  };

  private calculateColumns = () => {
    const container = this.el.shadowRoot?.querySelector(".products");
    if (!container) return 0;

    const cards = Array.from(container.querySelectorAll("vviinn-product-card"));
    if (cards.length === 0) return 0;

    const firstRowTop = cards[0].offsetTop;

    const columns = cards.filter(
      (card) => card.offsetTop === firstRowTop,
    ).length;

    this.el.style.setProperty(
      RESULTS_CALCULATED_COLUMNS_CSS_VAR,
      columns.toString(),
    );
  };

  private calculateCardHeight = () => {
    const firstCard = this.el.shadowRoot.querySelector("vviinn-product-card");
    if (firstCard) {
      const height = firstCard.getBoundingClientRect().height;
      this.el.style.setProperty(
        "--product-card-calculated-height",
        `${height}px`,
      );
    }
  };

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event() vviinnSelectedFiltersReset: EventEmitter<TriggerSourceEventData>;

  private getResults() {
    return (this.useInnerState ? this.innerResults : this.state.results) ?? [];
  }

  private replaceSlotsContent() {
    this.globalSlotsChanged.emit({
      slots: this.slots,
      element: this.el,
    });
  }

  private isSlotPassedToComponent = (name: string) =>
    this.passedSlotNames.includes(name);

  private renderProductCardSlots = () => {
    return productCardSlotNames
      .filter(this.isSlotPassedToComponent)
      .map((name) => (
        <span slot={name}>
          <slot name={name} />
        </span>
      ));
  };

  private renderVprIconSlot = () =>
    this.isSlotPassedToComponent(vprIconSlotName) ? (
      <slot name={vprIconSlotName} />
    ) : null;

  private resetDiscoveryAppendIndexes = () => {
    this.oneClickDiscoveryAppendIndex = undefined;
    this.oneClickDiscoverySelectedIndex = undefined;
  };

  private eventAbortController?: AbortController;

  private getCampaignType = () =>
    this.state.searchType === "text" ? "TPS" : "VPS";

  private isTextSearch = () => this.state.searchType === "text";

  private createTrackingEventBody(detail: ProductCardEventData) {
    const { productRank, productId, campaignTypeId, clickEvent, ...rest } =
      detail;
    return {
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    };
  }

  async componentWillLoad() {
    slotChangeListener(this, this.el);
    this.slots = findSlotElements(this.el);
    this.passedSlotNames = getSlotNames([...this.parentSlots, ...this.slots]);

    if (!this.showInWidget) {
      await initializeLocale(this.locale);
    }
  }

  componentDidRender() {
    this.replaceSlotsContentInButton
      ? this.replaceSlotsContentInButton(this.el)
      : this.showInWidget
        ? this.replaceSlotsContentInWidget(this.el)
        : this.replaceSlotsContent();
  }

  componentDidLoad() {
    this.resizeObserver.observe(this.el);
    this.calculateColumns();
    this.calculateCardHeight();
  }

  private skipStateChanges = (isTriggeredByVpsWidget: boolean) =>
    this.showInWidget !== isTriggeredByVpsWidget;

  private async getTextSearchResults(requestId?: string) {
    if (!this.state.textSearchQuery) return;

    const queryToUse = this.state.textSearchQuery;

    if (!requestId?.length) {
      resetStore(this.storeName, "appStateOnly");
      this.updateCampaignIds();

      this.vviinnCropperResetState.emit({
        isTriggeredByVpsWidget: this.showInWidget,
      });
      this.vviinnSelectedFiltersReset.emit({
        isTriggeredByVpsWidget: this.showInWidget,
      });
    }

    return pipe(
      await makeTextSearchRequest(this.storeName, queryToUse, this.token, {
        apiPath: this.apiPath,
        requestId,
        resultsCount: this.resultsCount,
      }),
      E.fold(
        () => {
          this.vviinnNoResult.emit(this.getBasicEventData("TPS"));
          return null;
        },
        (response) => response,
      ),
    );
  }

  private async getResultsByCategory(
    dynamicFilters?: RequestDynamicFilterItem[],
  ) {
    if (!this.isProductListingPage()) return;

    pipe(
      await makeProductListingPageRequest(
        this.filterColumn,
        this.filterValue,
        this.token,
        {
          apiPath: this.apiPath,
          resultsCount: this.resultsCount,
          dynamicFilters,
          skipStateUpdate: this.useInnerState,
        },
      ),
      E.fold(
        () => {
          this.vviinnNoResult.emit(this.getBasicEventData("TPS"));
        },
        (response: TextSearchResponse) => {
          if (this.useInnerState) this.innerResults = response.data.products;
        },
      ),
    );
  }

  private isProductListingPage = () =>
    !!this.filterColumn && !!this.filterValue && !this.showInWidget;

  private loadMoreResults = () => {
    const offset = this.state.resultsOffset;

    if (this.isProductListingPage()) {
      makeProductListingPageRequest(
        this.filterColumn,
        this.filterValue,
        this.token,
        {
          apiPath: this.apiPath,
          requestId: this.state.productListingPageId,
          resultsCount: this.resultsCount,
          dynamicFilters: extractSelectedFilters(this.state.dynamicFilters),
          offset,
        },
      );
    } else if (this.isTextSearch()) {
      makeTextSearchRequest(
        this.storeName,
        this.state.textSearchQuery,
        this.token,
        {
          apiPath: this.apiPath,
          requestId: this.state.textSearchId,
          resultsCount: this.resultsCount,
          offset,
        },
      );
    } else {
      makeVisualSearchRequest(this.storeName, null, this.token, {
        apiPath: this.apiPath,
        offset,
      });
    }
  };

  private async getVisualSearchResults(searchId?: string | null) {
    return pipe(
      await makeVisualSearchRequest(
        this.storeName,
        searchId ?? this.state.visualSearchId,
        this.token,
        { apiPath: this.apiPath },
      ),
      E.fold(
        () => {
          this.vviinnNoResult.emit(this.getBasicEventData("VPS"));
          return null;
        },
        (response) => response,
      ),
    );
  }

  private textSearchStartedHandler = async ({ detail }: TextSearchEvent) => {
    const { isTriggeredByVpsWidget } = detail;
    if (this.skipStateChanges(isTriggeredByVpsWidget)) return;

    if (!detail.query) return;

    setTextSearchQuery(this.storeName, detail.query);

    const { campaignTypeId, ...rest } = this.getBasicEventData("TPS");
    const textSearchStartedEvent: WidgetEvent = createWidgetEvent("TPS")({
      action: "search",
      session_id: this.uiSessionId,
      ...rest,
    });

    trackEvent(textSearchStartedEvent, this.token, this.apiPath);

    this.getTextSearchResults();
  };

  private filtersChangedHandler = async ({ detail }: ChangedFiltersEvent) => {
    const { filters, isTriggeredByVpsWidget } = detail;
    if (this.skipStateChanges(isTriggeredByVpsWidget)) return;

    if (this.filterColumn && this.filterValue) {
      this.getResultsByCategory(filters);
      return;
    }
    this.state.requestFilters = filters;

    if (this.isTextSearch()) {
      this.getTextSearchResults(this.state.textSearchId);
    } else {
      this.getVisualSearchResults();
    }
  };

  private filterTriggeredHandler = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    const { action, kind, customTrigger } = detail;
    const { campaignTypeId, ...rest } = this.getBasicEventData(customTrigger);

    if (action === "select" || action === "deselect" || action === "reset")
      resetResultEvents(this.storeName);

    if (customTrigger === "TPS") return;

    const eventBody = {
      session_id: this.uiSessionId,
      typ: "filter_event",
      action,
      kind,
      ...rest,
    };

    const filterEvent: FilterEvent = createFilterEvent(this.getCampaignType())(
      eventBody,
    );

    trackEvent(filterEvent, this.token, this.apiPath);
  };

  private imageUploadStartedHandler = ({
    detail,
  }: CustomEvent<ImageUploadEventData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    resetStore(this.storeName, "appStateOnly");
    this.updateCampaignIds();
  };

  private oneClickDiscoveryAppendClosedHandler = ({
    detail,
  }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetDiscoveryAppendIndexes();
  };

  connectedCallback() {
    const { state, storeName, onChange } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;

    const disposeSearchStatusListener = onChange(
      "searchStatus",
      (searchStatus) => {
        if (searchStatus === "loading") this.resetDiscoveryAppendIndexes();
      },
    );

    this.disposeStoreListener = () => {
      disposeSearchStatusListener();
    };

    if (this.el.id) this.widgetElementId = this.el.id;

    if (!this.uiSessionId) {
      this.uiSessionId = getUiSessionId(storeName);
    }

    this.eventAbortController = new AbortController();
    const { signal } = this.eventAbortController;

    addEventListenersWithSignal(
      document,
      [
        ["vviinnImageUploadStarted", this.imageUploadStartedHandler],
        ["vviinnTextSearchStarted", this.textSearchStartedHandler],
        ["vviinnFiltersChanged", this.filtersChangedHandler],
        ["vviinnFilterTriggered", this.filterTriggeredHandler],
        [
          "vviinnOneClickDiscoveryAppendClosed",
          this.oneClickDiscoveryAppendClosedHandler,
        ],
      ],
      signal,
    );

    const urlParams =
      this.resultsPageUrl && isOnResultsPage(this.resultsPageUrl)
        ? parseResultsPageParams(
            window.location.search,
            parseResultsPageParamNames(this.resultsPageParams),
          )
        : {};
    const effectiveSearchId = this.searchId || urlParams.searchId;
    const effectiveTextSearchQuery = this.textSearchQuery || urlParams.query;

    if (effectiveSearchId) this.getVisualSearchResults(effectiveSearchId);

    this.getResultsByCategory();

    if (effectiveTextSearchQuery && !this.state.textSearchQuery) {
      setTextSearchQuery(this.storeName, effectiveTextSearchQuery);
    }
    !this.showInWidget && this.getTextSearchResults();
  }

  disconnectedCallback() {
    resetStore(this.storeName, "all");
    this.eventAbortController?.abort();
    this.disposeStoreListener?.();
    this.resizeObserver.disconnect();
  }

  @Watch("textSearchQuery")
  watchTextSearchQuery(newQuery: string) {
    if (this.showInWidget) return;
    setTextSearchQuery(this.storeName, newQuery);
    this.getTextSearchResults();
  }

  @Watch("searchId")
  watchSearchId(newId: string) {
    if (this.showInWidget) return;
    if (newId) this.getVisualSearchResults(newId);
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    const productLoadEvent = this.getProductTrackEvent(detail, "load");
    trackEvent(productLoadEvent, this.token, this.apiPath);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.state.resultViewed) {
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
      this.state.resultViewed = true;
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");
    trackEvent(productViewEvent, this.token, this.apiPath);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

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
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    await trackEvent(productClickEvent, this.token, this.apiPath);
  }

  @Listen("vviinnAddToBasket")
  trackAddToBasket({ detail }: ProductCardEvent) {
    delete detail.discount;

    const eventBody = this.createTrackingEventBody(detail);
    const addToBasketEvent: AddToBasketEvent = createAddToBasketEvent(
      this.getCampaignType(),
    )(eventBody);

    trackEvent(addToBasketEvent, this.token, this.apiPath);
  }

  @Listen("vviinnAddToFavorite")
  trackAddToFavorite({ detail }: ProductCardEvent) {
    const eventBody = this.createTrackingEventBody(detail);
    const addToWishlistEvent: ProductEvent = createAddToWishlistEvent(
      this.getCampaignType(),
    )(eventBody);

    trackEvent(addToWishlistEvent, this.token, this.apiPath);
  }

  private trackResultEvent(type: ResultEventType) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultEventByType(
        type,
        campaignTypeId as Widget,
      )({
        session_id: this.uiSessionId,
        ...rest,
      });

    trackEvent(resultEvent, this.token, this.apiPath);
  }

  private findProductById(
    id: Recommendation["productId"],
  ): Recommendation | undefined {
    return this.getResults().find((r) => r.productId === id);
  }

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType,
  ): ProductEvent | null {
    if (!isTrackingEnabled()) return null;

    const eventBody = this.createTrackingEventBody(detail);

    const productEvent: ProductEvent = createProductEventByType(
      eventType,
      detail.campaignTypeId === "VCS" ? "VPC" : detail.campaignTypeId,
    )(eventBody);

    return productEvent;
  }

  private getBasicEventData = (customTrigger?: Widget): BasicEventData => {
    const textSearchCriteria = this.isTextSearch() || customTrigger === "TPS";
    const activeCampaign = textSearchCriteria ? "TPS" : "VPS";
    return {
      campaignTypeId: activeCampaign,
      campaignTypeName: campaignTypeNames[activeCampaign],
      widgetVersion: version,
      widget: activeCampaign,
      ...addIfNotEmpty("widgetId", this.widgetElementId),
    };
  };

  private getCurrentErrorType(): ErrorType | null {
    const resultsLength = this.getResults().length;

    if (this.showAspectRatioError) return "wrong-aspect-ratio";
    if (this.state.searchStatus === "error") return "server-error";
    if (resultsLength === 0 && this.state.searchStatus === "success")
      return "empty-results";

    return null;
  }

  private renderResults() {
    const widgetData = this.getBasicEventData();

    if (!this.state.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
      this.state.resultLoaded = true;
    }

    const shouldShowOneClickDiscoveryButton =
      oneClickDiscoveryModes.includes(this.oneClickDiscoveryMode) &&
      this.oneClickDiscoveryMode !== "unset";

    const isOneClickDiscoveryAppendMode =
      this.oneClickDiscoveryMode === "append-grid" ||
      this.oneClickDiscoveryMode === "append-slider";

    const oneClickDiscoveryHandler = (index: number) => {
      if (!isOneClickDiscoveryAppendMode) return;

      const containerComputerStyle = window.getComputedStyle(
        this.el.shadowRoot.getElementById("vviinn-results-products"),
      );
      const nCols = containerComputerStyle
        .getPropertyValue("grid-template-columns")
        .replace(" 0px", "")
        .split(" ").length;

      this.oneClickDiscoveryAppendIndex =
        index + (nCols - ((index % nCols) + 1));

      this.oneClickDiscoverySelectedIndex = index;

      const scrollToDiscovery = () => {
        const appendedContainer = this.el.shadowRoot.getElementById(
          "one-click-discovery-append",
        );

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const scrollableElement = isMobile ? this.scrollableModalBody : this.el;
        const scrollableContainer = this.showInWidget
          ? scrollableElement
          : window;

        const targetTop = appendedContainer.offsetTop;

        scrollableContainer.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      };

      setTimeout(scrollToDiscovery, SCROLL_TO_DISCOVERY_DELAY);
    };

    return this.getResults().map((p, i) => (
      <vviinn-product-card
        pricePrefix={this.pricePrefix}
        currencySign={this.currencySign}
        locale={this.locale}
        numberLocale={this.numberLocale}
        key={p.productId}
        index={i}
        productTitle={p.title}
        productId={p.productId}
        product={p}
        productType={p.productType}
        entityType={p.entityType}
        brand={p.brand}
        deeplink={p.deeplink}
        price={p.price.actual}
        salePrice={p.price.sale}
        basePrice={p.basePrice?.actual}
        baseSalePrice={p.basePrice?.sale}
        responsive={true}
        imageWidth={this.imageResolutionWidth}
        imageResolutionWidth={this.imageResolutionWidth}
        image={p.image?.thumbnail ?? p.image?.original}
        images={p.images}
        showMultipleImages={this.showMultipleImages}
        energyCertifications={p.energyCertifications}
        part="product-card"
        campaignTypeId={widgetData.campaignTypeId}
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={version}
        customLabels={getCustomLabels(p)}
        addToBasketShow={this.addToBasketShow}
        favoriteShow={this.favoriteShow}
        addPriceContainer={this.addPriceContainer}
        isResultsWidget={true}
        style={{ order: i.toString() }}
        showFooterArrow={this.oneClickDiscoverySelectedIndex === i}
      >
        {shouldShowOneClickDiscoveryButton && (
          <div
            slot="vviinn-product-card-actions"
            class="vviinn-results-product-card-actions"
          >
            <vviinn-vpr-button
              token={this.token}
              locale={this.locale}
              currencySign={this.currencySign}
              numberLocale={this.numberLocale}
              apiPath={this.apiPath}
              productId={p.productId}
              addStyle={false}
              isStandalone={false}
              sidebarTitle=""
              appendSidebarToId={
                isOneClickDiscoveryAppendMode
                  ? "one-click-discovery-append"
                  : undefined
              }
              appendSidebarToElement={
                isOneClickDiscoveryAppendMode
                  ? this.el.shadowRoot.getElementById(
                      "one-click-discovery-append",
                    )
                  : undefined
              }
              oneClickDiscoveryMode={this.oneClickDiscoveryMode}
              addToBasketShow={this.addToBasketShow}
              favoriteShow={this.favoriteShow}
              campaigns={this.oneClickDiscoveryCampaigns}
              cssUrl={this.cssUrl}
              imageResolutionWidth={this.imageResolutionWidth}
              showMultipleImages={this.showMultipleImages}
              showInWidget={this.showInWidget}
              uiSessionId={this.uiSessionId}
              onVviinnVprButtonActivated={() => oneClickDiscoveryHandler(i)}
            >
              {this.renderProductCardSlots()}
              {this.renderVprIconSlot()}
            </vviinn-vpr-button>
          </div>
        )}
      </vviinn-product-card>
    ));
  }

  private renderShowMoreButton(resultsLength: number) {
    const shouldShowButton =
      this.loadMore === "button" &&
      !this.useInnerState &&
      !this.showAspectRatioError &&
      this.state.searchStatus === "success" &&
      this.state.hasMoreResults;

    if (!shouldShowButton) return null;

    return (
      <div class="show-more" style={{ order: (resultsLength + 1).toString() }}>
        <button
          type="button"
          part={showMoreButtonPart}
          disabled={this.state.loadingMoreResults}
          aria-busy={this.state.loadingMoreResults ? "true" : "false"}
          onClick={this.loadMoreResults}
        >
          {i18next.t("buttons.showMore")}
        </button>
      </div>
    );
  }

  render() {
    const resultsLength = this.getResults().length;
    return (
      <Host
        id="results-block"
        class={{
          "show-in-widget": this.showInWidget,
          "matching-discovery": this.oneClickDiscoveryMode === "append-slider",
        }}
        exportparts={`${productCardParts}, ${listCardParts}, ${contentCardParts}, ${productCardsGridPart}, ${showMoreButtonPart}`}
      >
        {renderExternalCSS(this.cssUrl)}

        <div class="nothing-found">
          {this.getCurrentErrorType() && (
            <vviinn-error
              errorType={this.getCurrentErrorType()}
              handler={this.resetWidgetState}
              hasBackground={this.showInWidget}
              searchType={this.state.searchType}
            />
          )}
        </div>

        <div
          class={{
            hidden: this.showAspectRatioError || resultsLength === 0,
            products: true,
          }}
          part={productCardsGridPart}
          id="vviinn-results-products"
        >
          {resultsLength > 0 && this.renderResults()}
          <div
            id="one-click-discovery-append"
            style={{
              order: (
                this.oneClickDiscoveryAppendIndex ?? resultsLength
              ).toString(),
            }}
          ></div>
          {this.renderShowMoreButton(resultsLength)}
        </div>
      </Host>
    );
  }
}
