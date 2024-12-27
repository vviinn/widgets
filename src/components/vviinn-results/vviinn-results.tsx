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
  DefaultApi,
  EventConfirmation,
  FilterEvent,
  ResultLoadEvent,
  ResultViewEvent,
} from "vviinn-tracking-client-ts";
import { version } from "../../../package.json";
import {
  makeProductListingPageRequest,
  makeSearchIdRequest,
  makeTextSearchRequest,
  searchState,
  componentsState,
  SearchStore,
  SearchStoreName,
} from "../../store/search.store";
import { state } from "../../store/store";
import { createTrackingApi } from "../../openApi";
import { BasicEventData, Locale, Recommendation } from "../../components";
import { campaignTypeNames } from "../../campaign/Campaign";
import { TextSearchResponse } from "../../interfaces/search";
import {
  ChangedFiltersEvent,
  ChangedFiltersEventData,
  DynamicFilterTrackingData,
  ProductCardEvent,
  ProductCardEventData,
  ProductEvent,
  ProductEventType,
  ResetSelectedFiltersEventData,
  ResultEventType,
  SearchIdEvent,
  SearchIdEventData,
  TextSearchEvent,
  TextSearchEventData,
} from "../../recommendation/events";
import {
  createFilterEvent,
  createProductWidgetEventByType,
  createResultEventByType,
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
import { productCardParts } from "../../cssParts";
import { findSlotElements, getSlotNames } from "../../dom";

/**
 * @part product-card - Product Card itself.
 * @part image-container - Product Card's image container.
 * @part content-container - Product Card's content container.
 * @part basket-button-container - Product Card's basket button container.
 * @part brand - Brand inside Product Card.
 * @part product-type - Product Type inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around troduct title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part image-picture - Picture element for image.
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
 */

export type ReplaceSlotsContentInParent = (
  childrenElement?: HTMLElement
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
  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;
  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;
  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** The 'searchId' is received for performing a Visual Search */
  /** @internal */
  @Event() vviinnSearchIdReceived: EventEmitter<SearchIdEventData>;

  /** The 'query' is received for performing a Text Search */
  /** @internal */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;

  /** The filter's state changes */
  /** @internal */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;

  /** A search response was received by vviinn-results (used internally for showing preloader) */
  /** @internal */
  @Event() resultsSearchFinished: EventEmitter;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** Search ID for results request */
  @Prop() searchId?: string;
  /** uiSessionId from vps-widget */
  @Prop({ mutable: true }) uiSessionId?: string;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth?: number = 500;
  /** The currency sign is displayed after the price */
  @Prop() currencySign?: string = "€";
  /** The locale for currency formatting and text localization */
  @Prop() locale?: Locale = "de-DE";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab?: boolean = false;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect?: boolean = true;
  /** Show or hide Add to Basket buttons */
  @Prop() addToBasketShow: boolean = false;
  /** Show or hide Favorite button */
  @Prop() favoriteShow: boolean = false;
  /** Query for performing text search */
  @Prop() textSearchQuery?: string;
  /** ID for performing text search */
  @Prop() textSearchRequestId?: string;
  /** Column for performing Product Listing Page request */
  @Prop() filterColumn?: string = "product_type";
  /** Value for performing Product Listing Page request */
  @Prop() filterValue?: string;
  /** Number of results displayed for text search and product listing page (less or equal to the value, set in the campaign) */
  @Prop() resultsCount?: number;
  /** Wrap the Product Card's price values in the container. */
  @Prop() addPriceContainer?: boolean = false;

  /** True when we use vviinn-results inside the widget */
  @Prop() showInWidget?: boolean = false;
  /** Discovery Mode */
  @Prop() oneClickDiscoveryMode: undefined | "modal" | "append";
  /** Comma-separated list of campaign IDs */
  @Prop() oneClickDiscoveryCampaigns: string = "";

  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** Element Id, passed from vps-button */
  /** @internal */
  @Prop() buttonElementId?: string;
  /** Element Id, passed from vps-widget */
  /** @internal */
  @Prop() widgetElementId?: string;
  /** @internal */
  @Prop() showAspectRatioError?: boolean;
  /** @internal */
  @Prop({ mutable: true }) trackingDeactivated?: boolean = false;
  /** @internal */
  @Prop() resetState?: () => void;
  /** @internal */
  @Prop() replaceSlotsContentInWidget?: ReplaceSlotsContentInParent;
  /** @internal */
  @Prop() replaceSlotsContentInButton?: ReplaceSlotsContentInParent;
  /** @internal */
  @Prop() parentSlots?: HTMLSlotElement[] = [];

  @State() innerTextSearchQuery: string;
  @State() innerTextSearchRequestId: string;
  @State() slotsReplaced: boolean;
  @State() oneClickDiscoveryAppendIndex: number;
  @State() oneClickDiscoverySelectedIndex: number;
  @State() isTextSearch: boolean = this.textSearchQuery?.length > 0;

  private trackingApi: DefaultApi;
  private passedSlotNames?: string[] = [];
  private slots?: HTMLSlotElement[] = [];
  private state?: SearchStore;
  private storeName?: SearchStoreName;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  /** Selected filters should be resetted */
  /** @internal */
  @Event({ bubbles: true })
  vviinnSelectedFiltersReset: EventEmitter<ResetSelectedFiltersEventData>;

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

  async componentWillLoad() {
    slotChangeListener(this, this.el);
    this.slots = findSlotElements(this.el);
    this.passedSlotNames = getSlotNames([...this.parentSlots, ...this.slots]);

    if (!this.showInWidget) {
      await i18next.init({
        lng: this.locale,
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

  private skipFiltersChanges = (isTriggeredByVpsWidget: boolean) =>
    (isTriggeredByVpsWidget && !this.showInWidget) ||
    (!isTriggeredByVpsWidget && this.showInWidget);

  private getResultsBySearchId = async (searchId: string) => {
    if (!searchId) return;
    await makeSearchIdRequest(this.token, searchId);
    this.resultsSearchFinished.emit();
  };

  private async getVpsResults(filters?: RequestDynamicFilterItem[]) {
    if (!this.textSearchQuery) return;

    state.apiPath = this.apiPath; //FIXME: #36877

    await makeTextSearchRequest(
      this.storeName,
      this.textSearchQuery,
      filters,
      this.textSearchRequestId
    );
  }

  private async getTextSearchResults(
    query?: string,
    filters?: RequestDynamicFilterItem[],
    requestId?: string
  ) {
    if (!query) return;
    state.apiPath = this.apiPath; //FIXME: #36877

    return pipe(
      await makeTextSearchRequest(
        this.storeName,
        query,
        filters,
        requestId,
        this.resultsCount
      ),
      E.getOrElse(() => null),
      (response: TextSearchResponse) => response
    );
  }

  private async getResultsByCategory(
    dynamicFilters?: RequestDynamicFilterItem[]
  ) {
    if (!this.filterColumn || !this.filterValue || this.showInWidget) return;
    state.apiPath = this.apiPath; //FIXME: #36877

    await makeProductListingPageRequest(
      this.filterColumn,
      this.filterValue,
      this.resultsCount,
      dynamicFilters
    );
  }

  private searchIdReceivedHandler = ({ detail }: SearchIdEvent) => {
    this.getResultsBySearchId(detail.searchId);
  };

  private textSearchStartedHandler = async ({ detail }: TextSearchEvent) => {
    this.innerTextSearchQuery = detail.query;

    const { requestId } = await this.getTextSearchResults(
      this.innerTextSearchQuery
    );
    this.innerTextSearchRequestId = requestId;

    this.resultsSearchFinished.emit();
    this.vviinnSelectedFiltersReset.emit({
      isTriggeredByVpsWidget: false,
    });
  };

  private filtersChangedHandler = async ({ detail }: ChangedFiltersEvent) => {
    const { filters, isTriggeredByVpsWidget } = detail;

    if (this.skipFiltersChanges(isTriggeredByVpsWidget)) return;

    if (this.filterColumn && this.filterValue) {
      this.getResultsByCategory(filters);
      return;
    }

    const isVpsWidgetEvent = this.showInWidget && isTriggeredByVpsWidget;

    if (isVpsWidgetEvent) {
      return this.getVpsResults(filters);
    } else {
      return this.getTextSearchResults(
        this.innerTextSearchQuery,
        filters,
        this.innerTextSearchRequestId
      );
    }
  };

  private filtersTriggeredHandler = ({
    detail,
  }: CustomEvent<DynamicFilterTrackingData>) => {
    if (this.trackingDeactivated) return;
    this.isTextSearch = detail.customTrigger === "TPS";
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    const filterEvent: FilterEvent = createFilterEvent({
      session_id: this.uiSessionId,
      typ: "filter_event",
      ...rest,
      ...detail,
    });
    this.trackingApi.trackEvent(filterEvent).then(this.setTrackingDeactivated);
  };

  private widgetCloseHandler = () => {
    this.oneClickDiscoveryAppendIndex = undefined;
    this.oneClickDiscoverySelectedIndex = undefined;
  };

  connectedCallback() {
    state.apiPath = this.apiPath; //FIXME: #36877

    if (this.token) componentsState.token = this.token;
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.state = this.showInWidget ? searchState : componentsState;
    this.storeName = this.showInWidget ? "widget" : "components";

    if (!this.uiSessionId) {
      this.uiSessionId = uuidv4();
    }

    document.addEventListener(
      "vviinnSearchIdReceived",
      this.searchIdReceivedHandler
    );

    document.addEventListener(
      "vviinnTextSearchStarted",
      this.textSearchStartedHandler
    );

    document.addEventListener(
      "vviinnFiltersChanged",
      this.filtersChangedHandler
    );

    document.addEventListener(
      "vviinnFilterTriggered",
      this.filtersTriggeredHandler
    );

    document.addEventListener("vviinnWidgetClose", this.widgetCloseHandler);

    this.getResultsBySearchId(this.searchId);
    this.getResultsByCategory();

    if (!this.showInWidget) {
      this.innerTextSearchQuery = this.textSearchQuery;
      this.getTextSearchResults(this.innerTextSearchQuery);
    }
  }

  disconnectedCallback() {
    document.removeEventListener(
      "vviinnSearchIdReceived",
      this.searchIdReceivedHandler
    );

    document.removeEventListener(
      "vviinnTextSearchStarted",
      this.textSearchStartedHandler
    );

    document.removeEventListener(
      "vviinnFiltersChanged",
      this.filtersChangedHandler
    );

    document.removeEventListener(
      "vviinnFilterTriggered",
      this.filtersTriggeredHandler
    );

    document.removeEventListener("vviinnWidgetClose", this.widgetCloseHandler);
  }

  @Watch("textSearchQuery")
  watchTextSearchQuery(newQuery: string) {
    if (this.showInWidget) return;
    this.getTextSearchResults(newQuery);
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    const productLoadEvent = this.getProductTrackEvent(detail, "load");
    if (!productLoadEvent) return;
    this.trackingApi
      .trackEvent(productLoadEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.state.resultViewed) {
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
      this.state.resultViewed = true;
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");
    if (!productViewEvent) return;

    this.trackingApi
      .trackEvent(productViewEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const { productId, clickEvent } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(productClickEvent)
        .then(this.setTrackingDeactivated)
        .finally(() => {
          this.handleOpenLink(product.deeplink, clickEvent);
        });
    } else {
      this.handleOpenLink(product.deeplink, clickEvent);
    }
  }

  @Listen("vviinnAuxClick")
  async trackAuxClick({ detail }: ProductCardEvent) {
    const { productId } = detail;
    const productClickEvent = this.getProductTrackEvent(detail, "click");

    const product = this.findProductById(productId);
    if (!product || !product.deeplink) return;

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(productClickEvent)
        .then(this.setTrackingDeactivated);
    }
  }

  private setTrackingDeactivated = (result: EventConfirmation) => {
    if (result.status === "rejected") {
      this.trackingDeactivated = true;
    }
  };

  private trackResultEvent(type: ResultEventType) {
    if (this.trackingDeactivated) return;
    const { campaignTypeId, widgetType, widget, ...rest } =
      this.getBasicEventData();

    let resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultEventByType(
        type,
        widget ?? "VPS"
      )({
        session_id: this.uiSessionId,
        ...rest,
      });

    this.trackingApi.trackEvent(resultEvent).then(this.setTrackingDeactivated);
  }

  private findProductById(
    id: Recommendation["productId"]
  ): Recommendation | undefined {
    return this.state.results.find((r) => r.productId === id);
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
    eventType: ProductEventType
  ): ProductEvent | null {
    if (this.trackingDeactivated) return null;

    const {
      productRank,
      productId,
      campaignTypeId,
      widgetType,
      clickEvent,
      ...rest
    } = detail;

    const eventBody = {
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    };

    const productEvent: ProductEvent = createProductWidgetEventByType(
      widgetType === "VCS" ? "VPC" : widgetType,
      eventType
    )(eventBody);

    return productEvent;
  }

  private getBasicEventData = (): BasicEventData => {
    const activeCampaign = this.isTextSearch ? "TPS" : "VPS";
    return {
      widgetType: activeCampaign,
      campaignTypeId: activeCampaign,
      campaignTypeName: campaignTypeNames[activeCampaign],
      widgetId: this.widgetElementId,
      widgetVersion: version,
      widget: this.isTextSearch ? "TPS" : undefined,
    };
  };

  private renderResults() {
    const widgetData = this.getBasicEventData();

    if (this.state.results.length === 0) return null;
    if (!this.state.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
      this.state.resultLoaded = true;
    }

    const isOneClickDiscoveryAppendMode =
      this.oneClickDiscoveryMode === "append";

    const oneClickDiscoveryHandler = (index: number) => {
      if (!isOneClickDiscoveryAppendMode) return;

      const containerComputerStyle = window.getComputedStyle(
        this.el.shadowRoot.getElementById("vviinn-results-products")
      );
      const nCols = containerComputerStyle
        .getPropertyValue("grid-template-columns")
        .replace(" 0px", "")
        .split(" ").length;

      this.oneClickDiscoveryAppendIndex =
        index + (nCols - ((index % nCols) + 1));

      this.oneClickDiscoverySelectedIndex = index;
    };

    return this.state.results.map((p, i) => (
      <vviinn-product-card
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
        image={p.image.thumbnail ?? p.image.original}
        energyCertifications={p.energyCertifications}
        part="product-card"
        campaignTypeId={widgetData.campaignTypeId}
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={version}
        currency={this.currencySign}
        locale={this.locale}
        customLabels={getCustomLabels(p)}
        addToBasketShow={this.addToBasketShow}
        favoriteShow={this.favoriteShow}
        addPriceContainer={this.addPriceContainer}
        isResultsWidget={true}
        style={{ order: i.toString() }}
        showFooterArrow={this.oneClickDiscoverySelectedIndex === i}
      >
        {!!this.oneClickDiscoveryMode && (
          <div
            slot="vviinn-product-card-actions"
            class="vviinn-results-product-card-actions"
          >
            <vviinn-vpr-button
              onClick={() => oneClickDiscoveryHandler(i)}
              token={this.token}
              productId={p.productId}
              addStyle={false}
              appendSidebarTo={
                isOneClickDiscoveryAppendMode
                  ? "one-click-discovery-append"
                  : undefined
              }
              appendSidebarToElement={
                isOneClickDiscoveryAppendMode
                  ? this.el.shadowRoot.getElementById(
                      "one-click-discovery-append"
                    )
                  : undefined
              }
              addToBasketShow={this.addToBasketShow}
              locale={this.locale}
              favoriteShow={this.favoriteShow}
              campaigns={this.oneClickDiscoveryCampaigns}
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
    return (
      <Host
        id="results-block"
        class={{
          "show-in-widget": this.showInWidget,
        }}
        exportparts={productCardParts}
      >
        <div class="nothing-found">
          {this.state.results.length === 0 && this.showInWidget && (
            <vviinn-empty-results handler={() => this?.resetState()} />
          )}

          {this.showAspectRatioError && this.showInWidget && (
            <vviinn-wrong-aspect-ratio handler={() => this?.resetState()} />
          )}
        </div>

        <div
          class={{
            hidden:
              this.showAspectRatioError || this.state.results.length === 0,
            products: true,
          }}
          id="vviinn-results-products"
        >
          {this.renderResults()}
          <div
            id="one-click-discovery-append"
            style={{
              order: (
                this.oneClickDiscoveryAppendIndex ?? this.state.results.length
              ).toString(),
            }}
          ></div>
        </div>
      </Host>
    );
  }
}
