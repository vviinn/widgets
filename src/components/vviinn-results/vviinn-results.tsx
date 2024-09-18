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
  ResultLoadEvent,
  ResultViewEvent,
} from "vviinn-tracking-client-ts";
import { version } from "../../../package.json";
import {
  makeProductListingPageRequest,
  makeSearchIdRequest,
  makeSearchQueryRequest,
  makeTextSearchRequest,
  searchState,
} from "../../store/search.store";
import { state } from "../../store/store";
import { createTrackingApi } from "../../openApi";
import { BasicEventData, Locale, Recommendation } from "../../components";
import { campaignTypeNames } from "../../campaign/Campaign";
import {
  ProductListingPageResponse,
  SearchIdResponse,
  TextSearchResponse,
} from "../../interfaces/search";
import {
  ChangedFiltersEvent,
  ChangedFiltersEventData,
  DynamicFiltersEventData,
  ProductCardEvent,
  ProductCardEventData,
  ProductEvent,
  ProductEventType,
  ResultEventType,
  SearchIdEvent,
  SearchIdEventData,
  TextSearchEvent,
  TextSearchEventData,
} from "../../recommendation/events";
import {
  createProductVpsEventByType,
  createResultVpsEventByType,
} from "../../tracking";
import { RequestDynamicFilters } from "../../campaign/VPRCampaignService";
import { calculatePriceLabel } from "../vviinn-product-card/render-helpers";
import i18next from "i18next";
import { resources } from "../../locale";
import { slotChangeListener } from "../customized-slots";

/**
 * @part product-card - Product Card itself.
 * @part brand - Brand inside Product Card.
 * @part currency - Currency related to price.
 * @part deeplink - Anchor element around troduct title. Rendered only if "deeplink" property is filled.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-container - Block of prices.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part title - Title inside Product Card.
 *
 * @part price-label - string part of price.
 * @part price-label-0 - string part of price with index 0.
 * @part price-label-1 - string part of price with index 1.
 * @part price-label-2 - string part of price with index 2.
 * @part price-label-3 - string part of price with index 3.
 * @part price-label-4 - string part of price with index 4.
 *
 * @slot vviinn-energy-label-data-sheet-text - Text of the data sheet link for the energy label.
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

  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** The filter's state changes */
  /** @internal */
  @Event({ bubbles: true })
  vviinnFiltersChanged: EventEmitter<ChangedFiltersEventData>;
  /** The 'searchId' is received for performing a Visual Search */
  /** @internal */
  @Event() vviinnSearchIdReceived: EventEmitter<SearchIdEventData>;
  /** The 'query' is received for performing a Text Search */
  /** @internal */
  @Event() vviinnTextSearchStarted: EventEmitter<TextSearchEventData>;
  /** Dynamic filters are received from the API. */
  /** @internal */
  @Event() vviinnFilters: EventEmitter<DynamicFiltersEventData>;

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
  /** Query for performing text search */
  @Prop() textSearchQuery?: string;
  /** Column for performing Product Listing Page request */
  @Prop() filterColumn?: string = "product_type";
  /** Value for performing Product Listing Page request */
  @Prop() filterValue?: string;
  /** Number of results displayed for text search and product listing page (less or equal to the value, set in the campaign) */
  @Prop() resultsCount?: number;

  /** True when we use vviinn-results inside the widget */
  @Prop() showInWidget?: boolean = false;

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
  @Prop() replaceSlotsContentInWidget?: () => void;
  /** @internal */
  @Prop() replaceSlotsContentInButton?: () => void;

  @State() recommendations: Recommendation[] = [];
  @State() innerTextSearchQuery: string;
  @State() slotsReplaced: boolean;

  /** @internal */
  @Event({ bubbles: true, composed: true })
  globalSlotsChanged: EventEmitter<any>;

  private replaceSlotsContent() {
    const slots = this.el.querySelectorAll("[slot]");
    this.globalSlotsChanged.emit({
      slots: Array.from(slots),
      element: this.el,
    });
  }

  async componentWillLoad() {
    slotChangeListener(this, this.el);

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
      ? this.replaceSlotsContentInButton()
      : this.showInWidget
      ? this.replaceSlotsContentInWidget()
      : this.replaceSlotsContent();
  }

  private trackingApi: DefaultApi;

  private getResultsBySearchId = async (searchId: string) => {
    if (!searchId || this.showInWidget) return;
    state.apiPath = this.apiPath; //FIXME: #36877
    pipe(
      await makeSearchIdRequest(this.token, searchId),
      E.getOrElse(() => []),
      (results: SearchIdResponse) => {
        this.recommendations = results;
      }
    );
  };

  private async getResultsByTextQuery(
    query?: string,
    filters?: RequestDynamicFilters
  ) {
    if (!query) return;
    state.apiPath = this.apiPath; //FIXME: #36877

    if (this.showInWidget) {
      return pipe(
        await makeTextSearchRequest(this.token, query, filters),
        E.getOrElse(() => null),
        (response: TextSearchResponse) => response
      );
    } else {
      return pipe(
        await makeSearchQueryRequest(
          this.token,
          query,
          filters,
          this.resultsCount
        ),
        E.getOrElse(() => null),
        (response: TextSearchResponse) => {
          this.recommendations = response?.data?.products ?? [];
          this.vviinnFilters.emit(response?.data?.interactions.dynamicFilters);
        }
      );
    }
  }

  private async getResultsByCategory() {
    if (!this.filterColumn || !this.filterValue || this.showInWidget) return;
    state.apiPath = this.apiPath; //FIXME: #36877

    pipe(
      await makeProductListingPageRequest(
        this.token,
        this.filterColumn,
        this.filterValue,
        this.resultsCount
      ),
      E.getOrElse(() => null),
      (response: ProductListingPageResponse) => {
        this.recommendations = response?.data?.products ?? [];
      }
    );
  }

  private searchIdReceivedHandler = ({ detail }: SearchIdEvent) => {
    this.getResultsBySearchId(detail.searchId);
  };

  private textSearchStartedHandler = ({ detail }: TextSearchEvent) => {
    if (this.showInWidget) return;
    this.getResultsByTextQuery(detail.query);
    this.innerTextSearchQuery = detail.query;
  };

  private filtersChangedHandler = ({ detail }: ChangedFiltersEvent) => {
    this.getResultsByTextQuery(
      this.textSearchQuery ?? this.innerTextSearchQuery,
      detail.filters
    );
  };

  connectedCallback() {
    this.trackingApi = createTrackingApi(this.apiPath, this.token);

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

    this.getResultsBySearchId(this.searchId);
    this.getResultsByCategory();
    !this.showInWidget && this.getResultsByTextQuery(this.textSearchQuery);
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
  }

  @Watch("textSearchQuery")
  watchTextSearchQuery(newQuery: string) {
    if (this.showInWidget) return;
    this.getResultsByTextQuery(newQuery);
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
    if (!searchState.resultViewed) {
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
      searchState.resultViewed = true;
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
    const { campaignTypeId, widgetType, ...rest } = this.getBasicEventData();

    let resultEvent: ResultViewEvent | ResultLoadEvent =
      createResultVpsEventByType(type)({
        session_id: this.uiSessionId,
        ...rest,
      });

    this.trackingApi.trackEvent(resultEvent).then(this.setTrackingDeactivated);
  }

  private findProductById(
    id: Recommendation["productId"]
  ): Recommendation | undefined {
    return (
      this.recommendations.length ? this.recommendations : searchState.results
    ).find((r) => r.productId === id);
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

    const productEvent: ProductEvent =
      createProductVpsEventByType(eventType)(eventBody);

    return productEvent;
  }

  private getBasicEventData = (): BasicEventData => {
    return {
      widgetType: "VPS",
      campaignTypeId: "VPS",
      campaignTypeName: campaignTypeNames["VPS"],
      widgetId: this.widgetElementId,
      widgetVersion: version,
    };
  };

  private renderResults() {
    const results = this.showInWidget
      ? searchState.results
      : this.recommendations;

    if (results.length === 0) return null;
    if (!searchState.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
      searchState.resultLoaded = true;
    }

    return results.map((p, i) => (
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
        responsive={true}
        imageWidth={this.imageResolutionWidth}
        image={p.image.thumbnail ?? p.image.original}
        energyCertifications={p.energyCertifications}
        part="product-card"
        campaignTypeId="VPS"
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={version}
        currency={this.currencySign}
        locale={this.locale}
        priceLabel={calculatePriceLabel(p)}
        isResultsWidget={true}
      />
    ));
  }

  render() {
    return (
      <Host
        id="results-block"
        class={{
          "show-in-widget": this.showInWidget,
        }}
        exportparts="brand, deeplink, currency, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, title, product-card, price-label, price-label-0, price-label-1, price-label-2, price-label-3, price-label-4"
      >
        <div
          class={{
            "nothing-found": true,
            hidden:
              this.recommendations.length > 0 ||
              searchState.results.length > 0 ||
              !this.showInWidget,
          }}
        >
          <vviinn-empty-results handler={() => this?.resetState()} />
        </div>

        <div
          class={{
            "nothing-found": true,
            hidden: !this.showAspectRatioError || !this.showInWidget,
          }}
        >
          <vviinn-wrong-aspect-ratio handler={() => this?.resetState()} />
        </div>

        <div
          class={{
            hidden:
              this.showAspectRatioError ||
              (this.recommendations.length === 0 &&
                searchState.results.length === 0),
            products: true,
          }}
        >
          {this.renderResults()}
        </div>
      </Host>
    );
  }
}
