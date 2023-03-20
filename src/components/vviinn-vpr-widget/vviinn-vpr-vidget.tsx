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
import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import * as E from "fp-ts/lib/Either";
import { createBearAuthedHeader } from "./token-helpers";
import { state } from "../../store/store";
import { CampaignName } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { imageSearchState } from "../../store/imageSearch.store";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { Recommendation } from "../../recommendation/recommendation";
import { Subject } from "rxjs";
import { v4 as uuidv4 } from "uuid";

import {
  DefaultApi,
  EventConfirmation,
  ProductClickEvent,
  ProductViewEvent,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import { createTrackingApi } from "../../openApi";
import { ProductCardEvent } from "../../recommendation/events";
import {
  createProductClickVprEvent,
  createProductViewVprEvent,
  createWidgetVprEvent,
} from "../../tracking";
import { checkEmpryString } from "../../utils/option/option";

/**
 * @part product-card - product card itself
 * @part title - title inside product card
 * @part brand - brand inside product card
 * @part currency - brand inside product card
 * @part image - product card image
 * @part image-link - anchor element around product image
 * @part price-amount-sale - numeric part of price.
 * @part price-amount-outdated - numeric part of price.
 * @part price-amount-regular - numeric part of price.
 * @part price-container - block of prices
 * @part price-outdated - block for outdated price. rendered when product contains sale price
 * @part price-prefix - block rendered before each price element (for ex. "from")
 * @part price-regular - block for price if no sale price presented
 * @part price-sale -  block for sale price. rendered only if sale price presented
 * @part carousel-button
 */
@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Title for recommendations widget */
  @Prop() blockTitle: string = "Recommended products";
  /** Ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** Id of product you need recommendations for */
  @Prop() productId: string;
  /** vviinn customer token */
  @Prop() token: string;
  /** Currency sign will shown after price */
  @Prop() currencySign: string = "€";
  /** prefix will shown before price */
  @Prop() pricePrefix: string;
  /** Use slider or grid view */
  @Prop() mode: CarouselMode = "continuity";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** Locale for currency formatting */
  @Prop() locale: string = "de-DE";
  /** comma-separated list of campaign-ids */
  @Prop() campaigns: string = "";
  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";
  /** @internal */
  @Prop() useCarousel: boolean = true;

  @Prop() showScroll = true;
  @Prop() cssUrl: string | null = null;

  @State() recommendations: Recommendation[] = [];
  @State() loaded: boolean = false;
  @State() trackingDeactivated: boolean = false;

  @Event() recommendationsLoaded: EventEmitter;

  private productIds: string[];
  private productImageLoadedSubject = new Subject();
  trackingApi: DefaultApi;
  uiSessionId: string;

  setTrackingDeactivated = (result: EventConfirmation) => {
    if (result.status === "rejected") {
      this.trackingDeactivated = true;
    }
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

  @Watch("apiPath")
  handleApiPathChange(newPath: string) {
    state.apiPath = newPath;
    this.getRecommendations();
  }

  @Listen("productImageLoaded")
  handleImageLoading({ detail }: CustomEvent<string>) {
    this.productImageLoadedSubject.next(detail);
  }

  @Listen("recommendationView")
  trackRecommendationView({ detail }: ProductCardEvent) {
    if (this.trackingDeactivated) return;

    const recommendationViewEvent: ProductViewEvent = createProductViewVprEvent(
      {
        session_id: this.uiSessionId,
        ...detail,
      }
    );
    this.trackingApi
      .trackEvent(recommendationViewEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("recommendationClick")
  async trackRecommendationClick({ detail }: ProductCardEvent) {
    const recommendationClickEvent: ProductClickEvent =
      createProductClickVprEvent({
        session_id: this.uiSessionId,
        ...detail,
      });

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(recommendationClickEvent)
        .then(this.setTrackingDeactivated);
    }

    const product = this.recommendations.find(
      (r) => r.productId === detail.product
    );
    if (!product || !product.deeplink) return;
    window.location.href = product.deeplink;
  }

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);

    if (this.trackingDeactivated) return;

    const widgetOpenEvent: WidgetEvent = createWidgetVprEvent({
      action: "open",
      session_id: this.uiSessionId,
    });
    this.trackingApi
      .trackEvent(widgetOpenEvent)
      .then(this.setTrackingDeactivated);
  }

  disconnectedCallback() {
    if (this.trackingDeactivated) return;

    const widgetCloseEvent: WidgetEvent = createWidgetVprEvent({
      action: "close",
      session_id: this.uiSessionId,
    });
    this.trackingApi
      .trackEvent(widgetCloseEvent)
      .then(this.setTrackingDeactivated);
  }

  async componentWillLoad() {
    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;

    this.getRecommendations();
  }

  private async getRecommendations() {
    if (this.productId === undefined || this.token === undefined) return;

    const campaignType =
      this.campaignType.length > 0 ? this.campaignType : "VPR";
    const headers = createBearAuthedHeader(this.token);
    const request = pipe(
      TE.of(getRecommendationsService(campaignType)),
      TE.ap(TE.of(this.productId)),
      TE.ap(TE.of(checkEmpryString(this.campaigns))),
      TE.ap(TE.of(headers)),
      TE.flatten
    );

    const runRequest = await request();

    pipe(
      runRequest,
      E.fold(
        (error) => this.handleError(error),
        (data) => this.handleRecommendationsSucces(data)
      )
    );
  }

  private handleError(error: unknown): any {
    console.log("ERROR:", error);
  }

  private handleRecommendationsSucces(data: any) {
    this.recommendations = data?.extended ?? data;
    imageSearchState.results = this.recommendations;
    this.loaded = true;

    this.productIds = this.recommendations.map((r) => r.productId);
    this.productImageLoadedSubject.subscribe((id) => {
      this.productIds = this.productIds.filter((x) => x !== id);

      if (this.productIds.length === 0) {
        this.recommendationsLoaded.emit();
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

  render() {
    return (
      <Host
        class={{
          loaded: this.loaded,
          empty: this.recommendations.length == 0,
          [this.mode]: true,
        }}
        aria-hidden={this.loaded ? "false" : "true"}
      >
        {this.recommendations.length ? (
          <Fragment>
            {this.renderExternalCSS()}
            <style>{state.fallbackStyles}</style>
            <h2 part="recommendations-title">{this.blockTitle}</h2>
            {this.useCarousel ? this.renderCarousel() : this.renderResults()}
          </Fragment>
        ) : (
          ""
        )}
      </Host>
    );
  }

  private renderRecommendation(
    recommendation: Recommendation,
    index: number
  ): HTMLVviinnProductCardElement {
    return (
      <vviinn-product-card
        part="product-part"
        productId={recommendation.productId}
        productTitle={recommendation.title}
        deeplink={recommendation.deeplink}
        image={recommendation.image.thumbnail}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
        imageRatio={1}
        price={recommendation.price.actual}
        salePrice={recommendation.price.sale}
        responsive={this.mode === "grid"}
        dimmedBackground={this.useDimmedBackgroundInCard()}
        index={index}
      />
    );
  }

  private useDimmedBackgroundInCard(): boolean {
    return this.mode === "continuity" || !this.useCarousel;
  }

  private renderResults() {
    return (
      <div class="recommendations-grid" part="recommendations-grid">
        {this.recommendations.map((r, i) => this.renderRecommendation(r, i))}
      </div>
    );
  }

  private renderCarousel(): HTMLVviinnCarouselElement {
    return (
      <vviinn-carousel
        mode={this.mode}
        imageWidth={this.imageWidth}
        showScroll={this.showScroll}
        recommendations={this.recommendations}
      ></vviinn-carousel>
    );
  }
}
