import {
  Component,
  ComponentInterface,
  Prop,
  Element,
  Host,
  h,
  Event,
  EventEmitter,
  State,
  Watch
} from "@stencil/core";

import { processWidth } from "./render-helpers";
import state from "../../../store/store";
import { match, fromNullable, chain, map, getOrElse } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/function";
import { getAnalyticsModule } from "../../../analytics/GeneralAnalytics";
import { Recommendation } from "../../../recommendation/recommendation";
import { fetchInBackground } from "./imageLoader.worker";
import {
  ImageData,
  createImage,
  wrapInLink,
  getPriceComponent,
} from "./render-helpers";
import { checkEmpryString } from "../../../utils/option/option";

export type ImageSizes = {
  [rule: string]: number;
};

@Component({
  tag: "vpr-result",
  styleUrl: "vpr-result.css",
  shadow: true,
})
export class VprResult implements ComponentInterface {
  @Element() el: HTMLElement;
  @Prop() item: Recommendation;
  @Prop() imageWidth: number = 100;
  @Prop() imageRatio: number = 1;
  @Prop() imageSizes: ImageSizes | undefined = undefined;

  @State() imageUrl: string | undefined = undefined;

  /** Event fires ones when recommendation rendered on page */
  @Event() recommendationLoad: EventEmitter<Recommendation>;
  /** Event fires ones when recommendation appears on the viewport */
  @Event() recommendationView: EventEmitter<Recommendation>;
  /** Event fires ones when user click on deeplink */
  @Event() recommendationClick: EventEmitter<Recommendation>;

  private intersectionObserver = new IntersectionObserver(
    this.intersectionCallback.bind(this),
    { threshold: 1.0 }
  );

  async connectedCallback() {
    await this.processImageUrl();
  }

  async componentWillLoad() {
    this.el.style.setProperty(
      "--image-height",
      `${this.imageWidth * this.imageRatio}px`
    );

    this.el.style.setProperty("--image-ratio", `${this.imageRatio}`);
  }

  @Watch("item")
  async handleItemMutation() {
    await this.processImageUrl();
  }

  componentDidLoad() {
    this.recommendationLoad.emit(this.item);
    this.intersectionObserver.observe(this.el);

    const links = this.el.shadowRoot.querySelectorAll("a");
    links.forEach((link) =>
      link.addEventListener("mousedown", (event) => {
        this.recommendationClick.emit(this.item);

        if (window.ga) {
          event.preventDefault();
        }

        pipe(
          getAnalyticsModule(),
          match(
            () => null,
            (analytics) => analytics.sendClick(this.item)
          )
        );

        if (window.ga) {
          ga("send", "event", "UX", "click", "Results", {
            hitCallback: function() {
              document.location.href = this.item.deeplink;
            },
          });
        }
      })
    );
  }

  intersectionCallback(data: IntersectionObserverEntry[]) {
    if (data.some((entry) => entry.isIntersecting)) {
      pipe(
        getAnalyticsModule(),
        match(
          () => null,
          (analytics) => analytics.sendImpression(this.item)
        )
      );

      this.recommendationView.emit(this.item);
      this.intersectionObserver.disconnect();
    }
  }

  private async processImageUrl() {
    const imageUrl = this.item.image?.thumbnail ?? this.item.image.original;
    const resizedUrl = processWidth(imageUrl, this.imageWidth);

    this.imageUrl = await fetchInBackground(resizedUrl);
  }

  private renderImage() {
    if (!this.imageUrl) return null;

    const imageData: ImageData = {
      width: this.imageWidth,
      height: this.imageWidth * this.imageRatio,
      url: this.imageUrl,
      srcSet: null,
      title: this.item.title,
    };

    return pipe(
      this.item.deeplink,
      fromNullable,
      chain(checkEmpryString),
      match(
        () => createImage(imageData),
        (deeplink) => wrapInLink(deeplink, createImage(imageData))
      )
    );
  }

  private renderTitle() {
    if (!this.imageUrl) return null;

    return pipe(
      this.item.deeplink,
      fromNullable,
      chain(checkEmpryString),
      match(
        () => (
          <span
            part="product-title"
            class="product title"
            title={this.item.title}
          >
            {this.item.title}
          </span>
        ),
        (deeplink) => (
          <a
            part="product-title"
            class="product title"
            title={this.item.title}
            href={deeplink}
          >
            {this.item.title}
          </a>
        )
      )
    );
  }

  private renderBrand() {
    if (!this.imageUrl) return null;

    return pipe(
      this.item.brand,
      fromNullable,
      map((brand) => (
        <span part="brand" class="brand">
          {brand}
        </span>
      )),
      getOrElse(() => null)
    );
  }

  private renderProductType() {
    if (!this.imageUrl) return null;

    return pipe(
      this.item.productType,
      fromNullable,
      map((productType) => (
        <span part="product-type" class="product-type">
          {productType}
        </span>
      )),
      getOrElse(() => null)
    );
  }

  private renderPrice() {
    if (!this.imageUrl) return null;

    return pipe(
      this.item.price,
      fromNullable,
      map(getPriceComponent),
      getOrElse(() => null)
    );
  }

  render() {
    return (
      <Host
        exportparts="product, price-discount, price-container, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type"
        part="product"
      >
        <style>{state.fallbackStyles}</style>
        {this.item === undefined
          ? null
          : [
            this.renderImage(),
            this.renderTitle(),
            this.renderBrand(),
            this.renderProductType(),
            this.renderPrice(),
          ]}
      </Host>
    );
  }
}
