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
import { state } from "../../store/store";
import { CampaignName, campaignTypeNames } from "../../campaign/Campaign";
import { getRecommendationsService } from "../../campaign/CampaignService";
import { imageSearchState } from "../../store/imageSearch.store";
import { CarouselMode } from "../vviinn-carousel/vviinn-carousel";
import { Recommendation } from "../../recommendation/recommendation";

import {
  DefaultApi,
  EventConfirmation,
  WidgetAction,
  WidgetEvent,
} from "vviinn-tracking-client-ts";
import { createTrackingApi } from "../../openApi";
import {
  ProductCardEvent,
  BasicEventData,
  ProductCardEventData,
  ProductEventType,
  ProductEvent,
} from "../../recommendation/events";
import {
  createWidgetVprEvent,
  createWidgetVpcEvent,
  createProductVpcEventByType,
  createProductVprEventByType,
} from "../../tracking";
import { checkEmpryString } from "../../utils/option/option";
import { parseExcluded } from "../../utils/collections/collectionsUtils";
import { resources } from "../../locale/resources-vpr";
import { Locale } from "../../locale";

/**
 * @part product-card - Product Card itself.
 * @part product-part - Will be deprecated. Use "product-card" instead.
 * @part title - Title inside Product Card.
 * @part brand - Brand inside Product Card.
 * @part currency - Currency related to price.
 * @part image - Product Card image.
 * @part image-link - Anchor element around product image. Rendered only if "deeplink" property is filled.
 * @part deeplink - Anchor element around product title. Rendered only if "deeplink" property is filled.
 * @part price-amount-sale - Numeric part of the price.
 * @part price-amount-outdated - Numeric part of the price.
 * @part price-amount-regular - Numeric part of the price.
 * @part price-container - Block of prices.
 * @part price-outdated - Block for outdated price. Rendered when the product contains the sale price.
 * @part price-regular - Block for a price if no sale price is presented.
 * @part price-sale - Block for sale price. Rendered only if the sale price is presented.
 * @part price-prefix - Block rendered before each price element (for ex. "from").
 * @part carousel-button - Button for carousel navigation.
 * @part recommendations-grid - For internal usage only!
 * @part recommendations-title - Title of the recommendations grid.
 */
@Component({
  tag: "vviinn-vpr-widget",
  styleUrl: "vviinn-vpr-widget.css",
  shadow: true,
})
export class VviinnVprWidget implements ComponentInterface {
  @Element() el: HTMLElement;
  /** Widget’s title (change it to fit your locale) */
  @Prop() blockTitle: string = "Recommended products";
  /** The ratio of each recommended product image */
  @Prop() imageRatio: number = 1;
  /** Width of each recommended product image */
  @Prop() imageWidth: number = 300;
  /** ID of product you need recommendations for (required) */
  @Prop() productId: string;
  /** Vviinn customer’s token (required) */
  @Prop() token: string;
  /** The currency sign is displayed after the price */
  @Prop() currencySign: string = "€";
  /** Prefix is displayed before the price */
  @Prop() pricePrefix: string = "";
  /** Switch between carousel modes */
  @Prop() mode: CarouselMode = "continuity";
  /** Campaign type */
  @Prop() campaignType: CampaignName = "VPR";
  /** The locale for currency formatting and text localization */
  @Prop() locale: Locale = "de-DE";
  /** Comma-separated list of campaign IDs */
  @Prop() campaigns: string = "";
  /** Accepts any hex color code */
  @Prop() color: string = "";
  /** Hiding disabled arrows in the carousel if true */
  @Prop() gridArrowsDynamic: boolean = false;
  /** A custom message is displayed when no results */
  @Prop() noResultText: string = "";
  /** Showing a message (when true) or hiding the whole widget, when no results */
  @Prop() noResultShow: boolean = true;
  /** Show or hide the scrollbar */
  @Prop() showScroll = true;
  /** Optional for custom CSS. It will overwrite all other settings */
  @Prop() cssUrl: string | null = null;
  /** Excluded filter. Example: "brand:Nike;custom_label_0:summer" */
  @Prop() excluded: string = "";
  /** Toggle for opening product link in new tab or not */
  @Prop() productDetailNewTab: boolean = false;

  /** @internal */
  @Prop() apiPath: string | undefined = "https://api.vviinn.com";
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

  @State() recommendations: Recommendation[] = [];
  @State() trackingDeactivated: boolean = false;
  @State() hasErrorOnLoad: boolean = false;

  /** The event emits on widget load */
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

  /** @internal */
  @Event() vviinnRecommendationsLoaded: EventEmitter;
  /** @internal */
  @Event({ bubbles: true })
  vviinnWidgetOpen: EventEmitter<BasicEventData>;
  /** @internal */
  @Event({ bubbles: true })
  vviinnWidgetClose: EventEmitter<BasicEventData>;

  private productIds: string[];
  private productImageLoadedSubject = new Subject();
  private id?: string;
  private resultViewed: boolean = false;

  private getBasicEventData(): BasicEventData {
    return {
      widgetType: "VPR",
      campaignTypeId: this.campaignType,
      campaignTypeName: campaignTypeNames[this.campaignType],
      widgetId: this.id,
      widgetVersion: version,
    };
  }

  private handleOpenLink(deeplink: string) {
    if (this.productDetailNewTab) {
      window.open(deeplink);
    } else {
      window.location.href = deeplink;
    }
  }

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

  @Watch("opened")
  trackWidgetOpen() {
    if (!this.opened) return;
    this.vviinnWidgetOpen.emit(this.getBasicEventData());
    this.trackWidgetEvent("open");
  }

  @Watch("closed")
  trackWidgetClose() {
    if (!this.closed) return;
    this.vviinnWidgetClose.emit(this.getBasicEventData());
    this.trackWidgetEvent("close");
  }

  connectedCallback() {
    state.apiPath = this.apiPath;
    state.currencySign = this.currencySign;
    state.locale = this.locale;
    this.id = this.buttonElementId ?? this.el.id;
    this.uiSessionId = uuidv4();
    this.trackingApi = createTrackingApi(this.apiPath, this.token);
    this.getRecommendations();

    i18next.init({
      lng: this.locale,
      fallbackLng: "de-DE",
      resources,
    });
    this.vviinnWidgetLoad.emit(this.getBasicEventData());
    this.trackWidgetEvent("load");
  }

  async componentWillLoad() {
    state.pricePrefix = this.pricePrefix;
    state.currencySign = this.currencySign;

    if (this.excluded) {
      this.excluded = parseExcluded(this.excluded);
    }
  }

  @Listen("vviinnProductLoad")
  trackProductLoad({ detail }: ProductCardEvent) {
    this.productImageLoadedSubject.next(detail.productId);

    const productLoadEvent = this.getProductTrackEvent(detail, "load");
    if (!productLoadEvent) return;

    this.trackingApi
      .trackEvent(productLoadEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductView")
  trackProductView({ detail }: ProductCardEvent) {
    if (!this.resultViewed) {
      this.resultViewed = true;
      this.vviinnResultView.emit(this.getBasicEventData());
    }

    const productViewEvent = this.getProductTrackEvent(detail, "view");
    if (!productViewEvent) return;

    this.trackingApi
      .trackEvent(productViewEvent)
      .then(this.setTrackingDeactivated);
  }

  @Listen("vviinnProductClick")
  async trackProductClick({ detail }: ProductCardEvent) {
    const product = this.recommendations.find(
      (r) => r.productId === detail.productId
    );
    if (!product || !product.deeplink) return;

    const productClickEvent = this.getProductTrackEvent(detail, "click");

    if (!this.trackingDeactivated) {
      await this.trackingApi
        .trackEvent(productClickEvent)
        .then(this.setTrackingDeactivated)
        .finally(() => {
          this.handleOpenLink(product.deeplink);
        });
    } else {
      this.handleOpenLink(product.deeplink);
    }
  }

  private trackWidgetEvent(action: WidgetAction) {
    if (this.trackingDeactivated) return;
    const { campaignTypeId, ...rest } = this.getBasicEventData();

    let widgetEvent: WidgetEvent;
    const eventBody = {
      action,
      session_id: this.uiSessionId,
      ...rest,
    };

    if (this.campaignType === "VCS") {
      widgetEvent = createWidgetVpcEvent(eventBody);
    } else if (this.campaignType === "VPR") {
      widgetEvent = createWidgetVprEvent(eventBody);
    }

    this.trackingApi.trackEvent(widgetEvent).then(this.setTrackingDeactivated);
  }

  private getProductTrackEvent(
    detail: ProductCardEventData,
    eventType: ProductEventType
  ): ProductEvent | null {
    if (this.trackingDeactivated) return null;

    const { productRank, productId, campaignTypeId, ...rest } = detail;

    let productEvent: ProductEvent;
    const eventBody = {
      session_id: this.uiSessionId,
      rank: productRank,
      product: productId,
      ...rest,
    };

    if (campaignTypeId === "VCS") {
      productEvent = createProductVpcEventByType(eventType)(eventBody);
    } else if (campaignTypeId === "VPR") {
      productEvent = createProductVprEventByType(eventType)(eventBody);
    }

    return productEvent;
  }

  private async getRecommendations() {
    if (this.productId === undefined || this.token === undefined) return;
    const campaignType =
      this.campaignType.length > 0 ? this.campaignType : "VPR";
    const headers = createBearAuthedHeader(this.token);

    const request = pipe(
      TE.of(getRecommendationsService(campaignType)),
      TE.ap(TE.of(this.productId)),
      TE.ap(TE.of(this.color)),
      TE.ap(TE.of(this.excluded)),
      TE.ap(TE.of(checkEmpryString(this.campaigns))),
      TE.ap(TE.of(headers)),
      TE.flatten
    );

    const runRequest = await request();

    pipe(
      runRequest,
      E.fold(
        (error) => {
          this.handleError(error);
          this.vviinnNoResult.emit(this.getBasicEventData());
          this.vviinnRecommendationsLoaded.emit();
        },
        (data) => this.handleRecommendationsSuccess(data)
      )
    );
  }

  private handleError(_: unknown): any {
    this.hasErrorOnLoad = true;
  }

  private handleRecommendationsSuccess(data: any) {
    this.vviinnResultLoad.emit(this.getBasicEventData());

    this.recommendations = data?.extended ?? data;
    imageSearchState.results = this.recommendations;

    this.productIds = this.recommendations.map((r) => r.productId);
    this.productImageLoadedSubject.subscribe((id) => {
      this.productIds = this.productIds.filter((x) => x !== id);

      if (this.productIds.length === 0) {
        this.vviinnRecommendationsLoaded.emit();
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
          <style>{state.fallbackStyles}</style>
          <h2 part="recommendations-title">{this.blockTitle}</h2>
          {this.recommendations.length > 0 &&
            (this.useCarousel ? this.renderCarousel() : this.renderResults())}

          {this.recommendations.length === 0 && this.hasErrorOnLoad && (
            <p class="no-result-text">
              {this.noResultText.length
                ? this.noResultText
                : i18next.t("noResultText")}
            </p>
          )}
        </Fragment>
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
        productType={recommendation.productType}
        deeplink={recommendation.deeplink}
        image={recommendation.image.thumbnail}
        brand={recommendation.brand}
        imageWidth={this.imageWidth}
        imageRatio={1}
        price={recommendation.price.actual}
        salePrice={recommendation.price.sale}
        responsive={this.mode === "grid"}
        dimmedBackground={this.useDimmedBackgroundInCard()}
        campaignTypeId={this.campaignType}
        index={index}
        widgetElementId={this.id}
        widgetVersion={version}
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
        campaignTypeId={this.campaignType}
        imageWidth={this.imageWidth}
        showScroll={this.showScroll}
        recommendations={this.recommendations}
        widgetElementId={this.id}
        widgetVersion={version}
        gridArrowsDynamic={this.gridArrowsDynamic}
      ></vviinn-carousel>
    );
  }
}
