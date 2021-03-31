import {
  Component,
  ComponentInterface,
  Prop,
  Element,
  Host,
  h,
  Event,
  EventEmitter,
} from "@stencil/core";

import { Image, Title, Price, Brand, ProductType } from "./render-helpers";
import state from "../../../store/store";
import { fold } from "fp-ts/lib/Option";
import { pipe } from "fp-ts/lib/pipeable";
import { getAnalyticsModule } from "../../../analytics/GeneralAnalytics";
import { Recommendation } from "../../../recommendation/recommendation";

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

  async componentWillLoad() {
    this.el.style.setProperty(
      "--image-height",
      `${this.imageWidth * this.imageRatio}px`
    );

    this.el.style.setProperty("--image-ratio", `${this.imageRatio}`);
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
          fold(
            () => null,
            (analytics) => analytics.sendClick(this.item)
          )
        );

        if (window.ga) {
          ga("send", "event", "UX", "click", "Results", {
            hitCallback: function () {
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
        fold(
          () => null,
          (analytics) => analytics.sendImpression(this.item)
        )
      );

      this.recommendationView.emit(this.item);
      this.intersectionObserver.disconnect();
    }
  }

  render() {
    return (
      <Host
        exportparts="product, price-discount, price-outdated, price-regular, product-title, price-amount, price-currency, product-image, product-image-link, brand, product-type"
        part="product"
      >
        <style>{state.fallbackStyles}</style>
        {this.item === undefined
          ? null
          : [
              Image(
                this.item,
                this.imageWidth,
                this.imageWidth * this.imageRatio
              ),
              Title(this.item),
              Brand(this.item),
              ProductType(this.item),
              Price(this.item, state.pricePrefix, state.currencySign),
            ]}
      </Host>
    );
  }
}
