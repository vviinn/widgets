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
import { pipe } from "fp-ts/lib/function";
import { v4 as uuidv4 } from "uuid";
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
  resetStore,
  useSearchStore,
} from "../../store/search.store";
import { globalState, trackEvent, updateGlobalState } from "../../store/store";
import {
  BasicEventData,
  ImageUploadEventData,
  Locale,
  Recommendation,
} from "../../components";
import { ErrorType } from "../vviinn-error";
import { campaignTypeNames } from "../../campaign/Campaign";
import { TextSearchResponse } from "../../interfaces/search";
import {
  ChangedFiltersEvent,
  ChangedFiltersEventData,
  DynamicFilterInternalData,
  ProductCardEvent,
  ProductCardEventData,
  ProductEvent,
  ProductEventType,
  ResultEventType,
  TextSearchEvent,
  TextSearchEventData,
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
import { RequestDynamicFilterItem } from "../../campaign/VPRCampaignService";
import i18next from "i18next";
import { resources } from "../../locale";
import {
  productCardSlotNames,
  slotChangeListener,
  vprIconSlotName,
} from "../customized-slots";
import { getCustomLabels } from "../../recommendation";
import { productCardParts, productCardsGridPart } from "../../cssParts";
import {
  findSlotElements,
  getSlotNames,
  addEventListenersWithSignal,
} from "../../dom";
import {
  OneClickDiscoveryMode,
  oneClickDiscoveryModes,
} from "../../widget/types";
import { RESULTS_WIDGET_IMAGE_RESOLUTION_WIDTH } from "../../widget/constants";
import { addIfNotEmpty } from "../../utils/collections/collectionsUtils";
import { RESULTS_CALCULATED_COLUMNS_CSS_VAR } from "../vviinn-carousel/constants";

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
 * @part energy-label-container - Energy label container.
 * @part energy-label-icon - Icon with an energy class.
 * @part energy-label-product-type - Product type.
 * @part energy-label-data-sheet-link - Data sheet link.
 *
 * @part custom-label-0 - Custom label with index 0.
 * @part custom-label-1 - Custom label with index 1.
 * @part custom-label-2 - Custom label with index 2.
 * @part custom-label-3 - Custom label with index 3.
 * @part custom-label-4 - Custom label with index 4.
 *
 * @slot vviinn-results-vpr-icon - One-click Discovery icon.
 * @slot vviinn-favorite-icon - Icon of Favorite button.
 * @slot vviinn-favorite-icon-pressed - Icon of pressed Favorite button.
 * @slot vviinn-basket-button-text - Text of Add to Basket button.
 * @slot vviinn-basket-button-icon - Text of Add to Basket icon.
 * @slot vviinn-basket-button-text-pressed - Text of pressed Add to Basket button.
 * @slot vviinn-basket-button-icon-pressed - Icon of pressed Add to Basket button.
 * @slot vviinn-custom-label-0 - Custom label with index 0.
 * @slot vviinn-custom-label-1 - Custom label with index 1.
 * @slot vviinn-custom-label-2 - Custom label with index 2.
 * @slot vviinn-custom-label-3 - Custom label with index 3.
 * @slot vviinn-custom-label-4 - Custom label with index 4.
 * @slot vviinn-image-placeholder-icon - Icon or content for the image placeholder.
 */

export type ReplaceSlotsContentInParent = (
  childrenElement?: HTMLElement,
) => void;

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

  /** The 'query' is received for performing a Text Search */
  /** @internal */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;

  /** The filter's state changes */
  /** @internal */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  /** Cropper state should be resetted */
  /** @internal */
  @Event() vviinnCropperResetState: EventEmitter<TriggerSourceEventData>;

  /** Vviinn customer's token (required) */
  @Prop() token: string;
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string;
  /** The locale for currency formatting and text localization */
  @Prop() locale?: Locale;
  /** Campaign ID used for Text Search */
  @Prop() campaignIdTextSearch: string = "";
  /** Campaign ID used for Visual Search */
  @Prop() campaignIdVisualSearch: string = "";
  /** Prefix is displayed before the price */
  @Prop() pricePrefix?: string;
  /** Search ID for results request */
  @Prop() searchId?: string;
  /** uiSessionId from vps-widget */
  @Prop({ mutable: true }) uiSessionId?: string;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth?: number = RESULTS_WIDGET_IMAGE_RESOLUTION_WIDTH;
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

  /** One-click Discovery Mode */
  @Prop() oneClickDiscoveryMode?: OneClickDiscoveryMode = "append-grid";
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";

  /** True when we use vviinn-results inside the widget */
  /** @internal */
  @Prop() showInWidget?: boolean = false;
  /** @internal */
  @Prop() apiPath?: string;
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

  private initResultEvents = () => {
    this.state.resultLoaded = false;
    this.state.resultViewed = false;
  };

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
      await i18next.init({
        lng: globalState.locale,
        fallbackLng: "en",
        resources,
      });
    }
  }

  componentDidRender() {
    !!this.replaceSlotsContentInButton
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
      await makeTextSearchRequest(
        this.storeName,
        queryToUse,
        requestId,
        this.resultsCount,
      ),
      E.getOrElse(() => null),
    );
  }

  private async getResultsByCategory(
    dynamicFilters?: RequestDynamicFilterItem[],
  ) {
    if (!this.filterColumn || !this.filterValue || this.showInWidget) return;

    pipe(
      await makeProductListingPageRequest(
        this.filterColumn,
        this.filterValue,
        this.resultsCount,
        dynamicFilters,
        this.useInnerState,
      ),
      E.getOrElse(() => null),
      (response: TextSearchResponse) => {
        if (this.useInnerState) this.innerResults = response.data.products;
      },
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

    trackEvent(textSearchStartedEvent);

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
      makeVisualSearchRequest(this.storeName, this.state.visualSearchId);
    }
  };

  private filterTriggeredHandler = ({
    detail,
  }: CustomEvent<DynamicFilterInternalData>) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    const { action, kind, customTrigger } = detail;
    const { campaignTypeId, ...rest } = this.getBasicEventData(customTrigger);

    if (action === "select" || action === "deselect" || action === "reset")
      this.initResultEvents();

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

    trackEvent(filterEvent);
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

  private imageCropHandler = ({ detail }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;

    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: this.showInWidget,
    });
    this.state.requestFilters = [];
  };

  private oneClickDiscoveryAppendClosedHandler = ({
    detail,
  }: TriggerSourceEvent) => {
    if (this.skipStateChanges(detail.isTriggeredByVpsWidget)) return;
    this.resetDiscoveryAppendIndexes();
  };

  connectedCallback() {
    updateGlobalState(this);
    const { state, storeName, onChange } = useSearchStore(this.showInWidget);
    this.state = state;
    this.storeName = storeName;

    this.disposeStoreListener = onChange("searchStatus", (searchStatus) => {
      if (searchStatus === "loading") this.resetDiscoveryAppendIndexes();
    });

    if (this.el.id) this.widgetElementId = this.el.id;

    if (!this.uiSessionId) {
      this.uiSessionId = uuidv4();
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
        ["vviinnImageCrop", this.imageCropHandler],
        [
          "vviinnOneClickDiscoveryAppendClosed",
          this.oneClickDiscoveryAppendClosedHandler,
        ],
      ],
      signal,
    );

    if (!!this.searchId) makeVisualSearchRequest(this.storeName, this.searchId);

    this.getResultsByCategory();

    if (this.textSearchQuery && !this.state.textSearchQuery) {
      setTextSearchQuery(this.storeName, this.textSearchQuery);
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
    if (newId) makeVisualSearchRequest(this.storeName, newId);
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    const productLoadEvent = this.getProductTrackEvent(detail, "load");
    trackEvent(productLoadEvent);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.state.resultViewed) {
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
      this.state.resultViewed = true;
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");
    trackEvent(productViewEvent);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    await trackEvent(productClickEvent).finally(() => {
      this.handleOpenLink(product.deeplink, clickEvent);
    });
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    await trackEvent(productClickEvent);
  }

  @Listen("vviinnAddToBasket")
  trackAddToBasket({ detail }: ProductCardEvent) {
    delete detail.discount;

    const eventBody = this.createTrackingEventBody(detail);
    const addToBasketEvent: AddToBasketEvent = createAddToBasketEvent(
      this.getCampaignType(),
    )(eventBody);

    trackEvent(addToBasketEvent);
  }

  @Listen("vviinnAddToFavorite")
  trackAddToFavorite({ detail }: ProductCardEvent) {
    const eventBody = this.createTrackingEventBody(detail);
    const addToWishlistEvent: ProductEvent = createAddToWishlistEvent(
      this.getCampaignType(),
    )(eventBody);

    trackEvent(addToWishlistEvent);
  }

  private trackResultEvent(type: ResultEventType) {
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    let resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultEventByType(
        type,
        campaignTypeId as Widget,
      )({
        session_id: this.uiSessionId,
        ...rest,
      });

    trackEvent(resultEvent);
  }

  private findProductById(
    id: Recommendation["productId"],
  ): Recommendation | undefined {
    return this.getResults().find((r) => r.productId === id);
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

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType,
  ): ProductEvent | null {
    if (!globalState.trackingEnabled) return null;

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

      requestAnimationFrame(() => {
        const appendedContainer = this.el.shadowRoot.getElementById(
          "one-click-discovery-append",
        );

        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const scrollableElement = isMobile ? this.scrollableModalBody : this.el;
        const scrollableContainer = this.showInWidget
          ? scrollableElement
          : window;

        scrollableContainer.scrollTo({
          top: appendedContainer.offsetTop,
          behavior: "smooth",
        });
      });
    };

    return this.getResults().map((p, i) => (
      <vviinn-product-card
        pricePrefix={globalState.pricePrefix}
        currency={globalState.currencySign}
        locale={globalState.locale}
        key={p.productId}
        index={i}
        productTitle={p.title}
        productId={p.productId}
        productType={p.productType}
        brand={p.brand}
        deeplink={p.deeplink}
        price={p.price.actual}
        salePrice={p.price.sale}
        basePrice={p.basePrice?.actual}
        baseSalePrice={p.basePrice?.sale}
        responsive={true}
        imageWidth={this.imageResolutionWidth}
        imageResolutionWidth={this.imageResolutionWidth}
        image={p.image.thumbnail || p.image.original}
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

  render() {
    const resultsLength = this.getResults().length;
    return (
      <Host
        id="results-block"
        class={{
          "show-in-widget": this.showInWidget,
          "matching-discovery": this.oneClickDiscoveryMode === "append-slider",
        }}
        exportparts={`${productCardParts}, ${productCardsGridPart}`}
      >
        <div class="nothing-found">
          {this.getCurrentErrorType() && (
            <vviinn-error
              errorType={this.getCurrentErrorType()}
              handler={() => this?.resetWidgetState()}
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
        </div>
      </Host>
    );
  }
}
