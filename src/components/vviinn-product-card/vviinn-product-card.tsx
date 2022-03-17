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

/**
 * @part brand - product brand.
 * @part currency - currency sign. Renders after price-amount.
 * @part deeplink - anchor element for title. Rendered only if "deeplink" property filled.
 * @part image - product image.
 * @part image-link - anchor element for image. Rendered only if "deeplink" property filled.
 * @part price-amount - numeric part of price.
 * @part price-container - block contains all prices.
 * @part price-outdated - renders inside price-container when "sale-price" property filled. Contains regular price.
 * @part price-prefix - renders before price-amount. Can be set with "price-prefix" property or inherited from parent component.
 * @part price-regular - renders inside price-container when "sale-price" property is empty.
 * @part price-sale - renders inside price-container when "sale-price" property filled. Contains sale price.
 * @part title - product title
 */
@Component({
  tag: "vviinn-product-card",
  styleUrl: "vviinn-product-card.css",
  shadow: true,
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
  @Prop() dimmedBackground: boolean = false;

  @State() imageLoaded: boolean = false;

  /** Event fires ones when recommendation rendered on page */
  @Event({ bubbles: true }) recommendationLoad: EventEmitter<string>;
  /** Event fires ones when recommendation appears on the viewport */
  @Event({ bubbles: true }) recommendationView: EventEmitter<string>;
  /** Event fires ones when user click on deeplink */
  @Event({ bubbles: true }) recommendationClick: EventEmitter<string>;

  @Event() productImageLoaded: EventEmitter<string>;

  private intersectionObserver = new IntersectionObserver(
    this.intersectionCallback.bind(this),
    { threshold: 1.0 }
  );

  private intersectionCallback(data: IntersectionObserverEntry[]) {
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct()))
      );

      this.recommendationView.emit(this.productId);
      this.intersectionObserver.disconnect();
    }
  }

  componentDidLoad() {
    this.recommendationLoad.emit(this.productId);
    this.intersectionObserver.observe(this.el);

    const links = this.el.shadowRoot.querySelectorAll("a");
    links.forEach((link) =>
      link.addEventListener("mousedown", (event) => {
        this.recommendationClick.emit(this.productId);

        if (window.ga) {
          event.preventDefault();
        }

        pipe(
          getAnalyticsModule,
          O.match(
            () => null,
            (analytics) => analytics.sendClick(this.getProduct())
          )
        );

        if (window.ga) {
          ga("send", "event", "UX", "click", "Results", {
            hitCallback: function () {
              document.location.href = this.deeplink;
            },
          });
        }
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

    return this.responsive
      ? ResponsiveImage(props, () => this.kek())
      : Image(props, () => this.kek());
  }

  private kek() {
    this.productImageLoaded.emit(this.productId);
  }

  render() {
    return (
      <Host
        part="product-card"
        class={{ dimmed: this.dimmedBackground }}
        exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title"
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
