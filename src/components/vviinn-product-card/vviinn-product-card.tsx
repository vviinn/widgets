import { Component, Host, h, Prop, Event, EventEmitter, Element, State } from "@stencil/core";
import { pipe } from "fp-ts/lib/function";
import { getAnalyticsModule } from "../../analytics/GeneralAnalytics";
import { state } from "../../store/store";
import { createImage, ImageData, wrapInLink } from "./render-helpers";
import * as O from "fp-ts/lib/Option";
import { imageSearchState } from "../../store/imageSearch.store";
import { Recommendation } from "../../recommendation/recommendation";

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
  @Prop() imageWidth: number = 100;
  @Prop() locale: string | undefined = undefined;
  @Prop() price: number | undefined;
  @Prop() pricePrefix: string | undefined = undefined;
  @Prop() productId: string;
  @Prop() productTitle: string;
  @Prop() productType: string | undefined;
  @Prop() salePrice: number | undefined;

  @State() imageLoaded: boolean = false;

  private imageEl;
  private titleEl;
  private brandEl;
  private typeEl;
  private priceEl;


  /** Event fires ones when recommendation rendered on page */
  @Event({ bubbles: true }) recommendationLoad: EventEmitter<string>;
  /** Event fires ones when recommendation appears on the viewport */
  @Event({ bubbles: true }) recommendationView: EventEmitter<string>;
  /** Event fires ones when user click on deeplink */
  @Event({ bubbles: true }) recommendationClick: EventEmitter<string>;

  private intersectionObserver = new IntersectionObserver(
    this.intersectionCallback.bind(this),
    { threshold: 1.0 }
  );

  intersectionCallback(data: IntersectionObserverEntry[]) {
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule,
        O.map((analytics) => analytics.sendImpression(this.getProduct()))
      );

      this.recommendationView.emit(this.productId);
      this.intersectionObserver.disconnect();
    }
  }

  connectedCallback() {
    this.renderElements();
  }

  componentWillUpdate() {
    this.renderElements();
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
            hitCallback: function() {
              document.location.href = this.deeplink;
            },
          });
        }
      })
    );
  }

  private renderElements() {
    this.imageEl = this.renderImage();
    this.titleEl = this.renderTitle();
    this.brandEl = this.renderSpan(this.brand, "brand");
    this.typeEl = this.renderSpan(this.productType, "product-type");
    this.priceEl = this.renderPrice();

  }

  private getProduct(): Recommendation {
    return imageSearchState.results.find(
      (r) => r.productId === this.productId
    );
  }

  private renderSpan(
    content: string | HTMLElement | HTMLElement[],
    name: string
  ): HTMLElement | null {
    return content ? (
      <span part={name} class={name}>
        {content}
      </span>
    ) : null;
  }

  private renderImage(): HTMLElement | null {
    if (!this.image) return null;

    const imageData: ImageData = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      url: this.image,
      title: this.productTitle,
    };

    if (!this.deeplink) return createImage(imageData);

    const linkData = {
      href: this.deeplink,
      class: "image-link",
      part: "image-link",
    };

    return wrapInLink(linkData, createImage(imageData));
  }

  private renderTitle(): HTMLElement {
    const title = this.renderSpan(this.productTitle, "title");

    if (!this.deeplink) return title;

    const linkData = {
      href: this.deeplink,
      class: "deeplink",
      part: "deeplink",
    };

    return wrapInLink(linkData, title);
  }

  private havePrice(): boolean {
    return (this.salePrice ?? this.price) != undefined;
  }

  private renderPricePrefix(): HTMLElement | null {
    const prefix = this.pricePrefix ?? state.pricePrefix;
    return prefix ? this.renderSpan(prefix, "price-prefix") : null;
  }

  private renderCurrency(): HTMLElement | null {
    const currency = this.currency ?? state.currencySign;
    return currency ? this.renderSpan(currency, "currency") : null;
  }

  private formatPrice(price: number): HTMLElement[] {
    const locale = this.locale ?? state.locale;
    const formattedPrice = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
    }).format(price);
    const priceElement = this.renderSpan(formattedPrice, "price-amount");

    return [this.renderPricePrefix(), priceElement, this.renderCurrency()];
  }

  renderRegularPrice(): HTMLElement {
    return this.salePrice
      ? this.renderSpan(this.formatPrice(this.price), "price-outdated")
      : this.renderSpan(this.formatPrice(this.price), "price-regular");
  }

  renderSalePrice(): HTMLElement | null {
    return this.salePrice
      ? this.renderSpan(this.formatPrice(this.salePrice), "price-sale")
      : null;
  }

  private renderPrice(): HTMLElement | null {
    return this.havePrice()
      ? this.renderSpan(
        [this.renderRegularPrice(), this.renderSalePrice()],
        "price-container"
      )
      : null;
  }

  render() {
    return (
      <Host exportparts="brand, currency, deeplink, image, image-link, price-amount, price-container, price-outdated, price-prefix, price-regular, price-sale, title">
        {this.imageEl}
        {this.titleEl}
        {this.brandEl}
        {this.typeEl}
        {this.priceEl}
      </Host>
    );
  }
}
