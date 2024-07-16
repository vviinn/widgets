import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen,
  Watch,
  State,
} from "@stencil/core";
import { version } from "../../../package.json";
import * as E from "fp-ts/Either";
import { BasicEventData, Locale, Recommendation } from "../../components";
import { v4 as uuidv4 } from "uuid";
import { processSearchIdQuery, searchState } from "../../store/search.store";
import { campaignTypeNames } from "../../campaign/Campaign";
import {
  ProductCardEvent,
  ProductCardEventData,
  ProductEvent,
  ProductEventType,
  ResultEventType,
} from "../../recommendation/events";
import {
  createProductVpsEventByType,
  createResultVpsEventByType,
} from "../../tracking";
import {
  DefaultApi,
  EventConfirmation,
  ResultLoadEvent,
  ResultViewEvent,
} from "vviinn-tracking-client-ts";
import { createTrackingApi } from "../../openApi";

@Component({
  tag: "vviinn-results",
  styleUrl: "vviinn-results.css",
  shadow: true,
})
export class VviinnResults {
  @Element() el: HTMLElement;

  /** Recommended product renders on the page */
  @Event() vviinnProductLoad: EventEmitter<ProductCardEventData>;

  /** Recommended product appears in the viewport. */
  @Event() vviinnProductView: EventEmitter<ProductCardEventData>;

  /** Click on the product’s link */
  @Event() vviinnProductClick: EventEmitter<ProductCardEventData>;

  /** The search result renders on the page */
  @Event() vviinnResultLoad: EventEmitter<BasicEventData>;

  /** The search result appears in the viewport */
  @Event() vviinnResultView: EventEmitter<BasicEventData>;

  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** Search ID for results request (required) */
  @Prop() searchId: string;
  /** Resolution width of an image in the product card */
  @Prop() imageResolutionWidth?: number = 250;
  /**  The currency sign is displayed after the price */
  @Prop() currencySign?: string = "€";
  /** The locale for currency formatting and text localization */
  @Prop() locale?: Locale = "de-DE";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailsNewTab?: boolean = true;
  /** Toggle for redirection to PDP on product's click */
  @Prop() productDetailsRedirect?: boolean = true;

  /** True when we use vviinn-results inside the widget */
  /** @internal */
  @Prop() showingInWidget?: boolean = false;
  /** uiSessionId from vps-widget */
  /** @internal */
  @Prop({ mutable: true }) uiSessionId?: string;
  /** Element Id, passed from vps-button */
  /** @internal */
  @Prop() buttonElementId?: string;
  /** Element Id, passed from vps-widget */
  /** @internal */
  @Prop() widgetElementId?: string;
  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  /** @internal */
  @Prop() showAspectRatioError?: boolean;
  /** @internal */
  @Prop({ mutable: true }) trackingDeactivated?: boolean = false;
  /** @internal */
  @Prop() resetState?: () => void;

  @State() recommendations: Recommendation[] = [];

  private trackingApi: DefaultApi;

  async connectedCallback() {
    this.trackingApi = createTrackingApi(this.apiPath, this.token);

    if (searchState.results) {
      this.recommendations = searchState.results;
    }

    if (!this.uiSessionId) {
      this.uiSessionId = uuidv4();
    }

    if (this.searchId) {
      const result = await processSearchIdQuery(this.searchId, this.token);
      this.recommendations = E.getOrElse(() => [])(result);
    }
  }

  @Watch("searchId")
  processSearchId(newId: string) {
    this.searchId && processSearchIdQuery(newId, this.token);
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
    return this.recommendations.find((r) => r.productId === id);
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
    if (this.recommendations.length === 0) return null;
    if (!searchState.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
      searchState.resultLoaded = true;
    }

    return this.recommendations.map((p, i) => (
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
        part="product-card"
        campaignTypeId="VPS"
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={version}
        currency={this.currencySign}
        locale={this.locale}
      />
    ));
  }

  render() {
    return (
      <Host
        id="results-block"
        class={{
          "widget-results": this.showingInWidget,
        }}
      >
        <div
          class={{
            "nothing-found": true,
            hidden: this.recommendations.length > 0 || !this.showingInWidget,
          }}
        >
          <vviinn-empty-results handler={() => this?.resetState()} />
        </div>

        <div
          class={{
            "nothing-found": true,
            hidden: !this.showAspectRatioError || !this.showingInWidget,
          }}
        >
          <vviinn-wrong-aspect-ratio handler={() => this?.resetState()} />
        </div>

        <div
          class={{
            hidden:
              this.recommendations.length === 0 || this.showAspectRatioError,
            products: true,
          }}
        >
          {this.renderResults()}
        </div>
      </Host>
    );
  }
}
