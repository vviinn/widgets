import {
  Component,
  Host,
  h,
  Prop,
  Event,
  EventEmitter,
  Element,
  State,
} from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { getAnalyticsModule } from "../../analytics/GeneralAnalytics";
import { state } from "../../store/store";
import * as O from "fp-ts/lib/Option";
import { imageSearchState } from "../../store/imageSearch.store";
import { Recommendation } from "../../recommendation/recommendation";
import {
  ImageProps,
  Linked,
  Price,
  ResponsiveImage,
  Image,
} from "./render-helpers";
import { ProductCardEventData } from "../../recommendation/events";

import styles from "./vviinn-product-card.css";
import { CampaignTypeId, campaignTypeTitle } from "../../campaign/Campaign";

/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount-sale - numeric part of price.
 * @part price-amount-outdated - numeric part of price.
 * @part price-amount-regular - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part title - product title
 */
@Component({
  tag: "vviinn-product-card",
  shadow: true,
  styles,
})
export class VviinnProductCard {
  @Element() el: HTMLElement;
  @Prop() brand: string | undefined;
  @Prop() currency: string | undefined = undefined;
  @Prop() deeplink: string | undefined;
  @Prop() image: string | undefined;
  @Prop() imageRatio: number = 1;
  @Prop() imageWidth: number = 200;
  @Prop() locale: string | undefined = undefined;
  @Prop() price: number | undefined;
  @Prop() pricePrefix: string | undefined = undefined;
  @Prop() productId: string;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() salePrice: number | undefined;
  @Prop() responsive: boolean = false;
  @Prop() campaignTypeId: CampaignTypeId;
  @Prop() dimmedBackground: boolean = false;

  /** @internal */
  @Prop() index: number = 0;

  @State() imageLoaded: boolean = false;

  /** Event fires ones when recommendation rendered on page */
  @Event({ eventName: "VviinnProductLoad", bubbles: true })
  vviinnProductLoad: EventEmitter<ProductCardEventData>;
  /** Event fires ones when recommendation appears on the viewport */
  @Event({ eventName: "VviinnProductView", bubbles: true })
  vviinnProductView: EventEmitter<ProductCardEventData>;
  /** Event fires ones when user click on deeplink */
  @Event({ eventName: "VviinnProductClick", bubbles: true })
  vviinnProductClick: EventEmitter<ProductCardEventData>;

  private productData: ProductCardEventData | null = null;

  private intersectionObserver = new IntersectionObserver(
    this.intersectionCallback.bind(this),
    { threshold: 1.0 }
  );

  connectedCallback() {
    this.productData = this.getProductData();
  }

  private getProductData() {
    return {
      product: this.productId,
      rank: this.index,
      campaignTypeId: this.campaignTypeId,
      campaignTitle: campaignTypeTitle[this.campaignTypeId],
    };
  }

  private intersectionCallback(data: IntersectionObserverEntry[]) {
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct()))
      );

      this.vviinnProductView.emit(this.productData);
      this.intersectionObserver.disconnect();
    }
  }

  componentDidLoad() {
    this.vviinnProductLoad.emit(this.productData);
    this.intersectionObserver.observe(this.el);

    const links = this.el.shadowRoot.querySelectorAll("a");

    links.forEach((link) =>
      link.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        this.vviinnProductClick.emit(this.getProductData());

        pipe(
          getAnalyticsModule,
          O.match(
            () => null,
            (analytics) => analytics.sendClick(this.getProduct())
          )
        );
      })
    );
  }

  private getProduct(): Recommendation {
    return imageSearchState.results.find((r) => r.productId === this.productId);
  }

  private renderImage() {
    const props: ImageProps = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      src: this.image,
      title: this.productTitle,
      lazy: false,
    };

    return this.responsive ? ResponsiveImage(props) : Image(props);
  }

  render() {
    return (
      <Host
        part="product-card"
        class={{ dimmed: this.dimmedBackground }}
        exportparts="brand, currency, deeplink, image, image-link, price-amount-sale, price-amount-outdated, price-amount-regular, price-container, price-outdated, price-regular, price-sale, price-prefix, title"
      >
        <Linked deeplink={this.deeplink} part="image-link">
          {this.renderImage()}
        </Linked>
        <Linked deeplink={this.deeplink} part="deeplink">
          <span class="title" part="title">
            {this.productTitle}
          </span>
        </Linked>
        <span class="brand" part="brand">
          {this.brand}
        </span>
        <span class="type" part="type">
          {this.productType}
        </span>
        <Price
          prefix={this.pricePrefix ?? state.pricePrefix}
          currency={this.currency ?? state.currencySign}
          price={this.price}
          salePrice={this.salePrice}
          locale={this.locale ?? state.locale}
        />
      </Host>
    );
  }
}
