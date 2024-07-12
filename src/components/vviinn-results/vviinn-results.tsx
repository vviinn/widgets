import {
  Component,
  Host,
  h,
  Prop,
  Element,
  Event,
  EventEmitter,
  Listen,
} from "@stencil/core";
import {
  BasicEventData,
  CampaignTypeId,
  Recommendation,
} from "../../components";
import { searchState } from "../../store/search.store";
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

  @Prop() token: string;
  @Prop() uiSessionId: string;
  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() imageWidth: number;
  @Prop() currencySign: string;
  @Prop() widgetVersion: string;
  @Prop() locale: string;
  @Prop() buttonElementId?: string;
  @Prop() widgetElementId?: string;
  @Prop() productDetailsRedirect?: boolean;
  @Prop() productDetailsNewTab?: boolean;
  @Prop() trackingDeactivated?: boolean;
  @Prop() showAspectRatioError?: boolean;
  @Prop() setTrackingDeactivated?: () => void;
  @Prop() resetState?: () => void;

  /** @internal */
  @Prop() resultLoaded?: boolean;
  /** @internal */
  @Prop() resultViewed?: boolean;
  /** @internal */
  @Prop() apiPath?: string = "https://api.vviinn.com";
  private trackingApi: DefaultApi;

  connectedCallback() {
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
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
    if (!this.resultViewed) {
      this.vviinnResultView.emit(this.getBasicEventData());
      this.trackResultEvent("view");
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
    return searchState.results.find((r) => r.productId === id);
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
      campaignTypeId: this.campaignTypeId,
      campaignTypeName: campaignTypeNames["VPS"],
      widgetId: this.widgetElementId,
      widgetVersion: this.widgetVersion,
    };
  };

  private renderResults() {
    if (searchState.results.length === 0) return null;
    if (!this.resultLoaded) {
      this.vviinnResultLoad.emit(this.getBasicEventData());
      this.trackResultEvent("load");
    }

    return searchState.results.map((p, i) => (
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
        imageWidth={this.imageWidth}
        image={p.image.thumbnail ?? p.image.original}
        part="product-card"
        campaignTypeId={this.campaignTypeId}
        widgetElementId={this.widgetElementId}
        buttonElementId={this.buttonElementId}
        widgetVersion={this.widgetVersion}
        currency={this.currencySign}
        locale={this.locale}
      />
    ));
  }

  render() {
    return (
      <Host id="results-block">
        <div
          class={{
            "nothing-found": true,
            hidden: searchState.results.length > 0,
          }}
        >
          <vviinn-empty-results handler={() => this.resetState()} />
        </div>

        <div
          class={{
            "nothing-found": true,
            hidden: !this.showAspectRatioError,
          }}
        >
          <vviinn-wrong-aspect-ratio handler={() => this.resetState()} />
        </div>

        <div
          class={{
            hidden:
              searchState.results.length === 0 || this.showAspectRatioError,
            products: true,
          }}
        >
          {this.renderResults()}
        </div>
      </Host>
    );
  }
}
