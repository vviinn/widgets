import {
  Component,
  Host,
  h,
  Element,
  State,
  Method,
  Prop,
} from "@stencil/core";
import { Recommendation } from "../../recommendation/recommendation";
import { GridMode } from "../../slider/GridMode";
import { rebuildProducts, rewrapProducts } from "./products.worker";
import { animationFrameScheduler } from "rxjs";
import { fromEvent } from "rxjs";
import { debounceTime } from "rxjs/operators";

@Component({
  tag: "vpr-slider",
  styleUrl: "vpr-slider.css",
  shadow: false,
})
export class VprSlider {
  @Element() el: HTMLElement;

  @Prop() mode: GridMode;
  @Prop() imageRatio: number = 1.5;
  @Prop() imageWidth: number = 100;
  @Prop() productsInGrid: number = 4;

  @State() wrappedItems: Recommendation[][] = [[]];
  @State() slidePosition: number = 0;

  private sliderMode: GridMode = "auto";
  private products: Recommendation[] = [];

  componentShouldUpdate() {
    this.updateSliderWrapperSize();
  }

  connectedCallback() {
    const resize = fromEvent(window, "resize");
    const resizeObserver = resize.pipe(debounceTime(50));

    resizeObserver.subscribe(() => {
      animationFrameScheduler.schedule(() => {
        this.updateSliderWrapperSize();
        this.sliderMode = Number.isNaN(this.getColumns())
          ? this.mode
          : "manual";

        switch (this.sliderMode) {
          case "auto":
            return this.rebuildSlides();
          case "manual":
            return this.wrapItems(this.products, this.getColumns());
        }
      });
    });

    this.sliderMode = Number.isNaN(this.getColumns()) ? this.mode : "manual";
  }

  componentDidLoad() {
    this.el.style.setProperty("--item-size", `${this.imageWidth}px`);
    this.updateSliderWrapperSize();
  }

  @Method()
  async resetSliderPosition() {
    this.slidePosition = 0;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  @Method()
  async loadProducts(products: Recommendation[]) {
    this.products = products;

    switch (this.sliderMode) {
      case "auto":
        return this.rebuildSlides();
      case "grid":
        return this.wrapItems(this.products, this.getProductsCount(products));
      case "manual":
        return this.wrapItems(this.products, this.getColumns());
    }
  }

  private getColumns(): number {
    return parseInt(getComputedStyle(this.el).getPropertyValue("--columns"));
  }

  private getProductsCount(products: Recommendation[]): number {
    return this.productsInGrid ?? products.length ?? 1;
  }

  private async rebuildSlides() {
    const slideSize = this.getSlideSize();
    const margin = parseInt(
      getComputedStyle(this.el).getPropertyValue("font-size")
    );

    this.wrappedItems = await rebuildProducts(
      this.products,
      slideSize,
      margin,
      this.imageWidth
    );

    this.updateSliderWrapperSize();
  }

  private getSlideSize(): number {
    return this.el.querySelector(".slides-wrapper").getBoundingClientRect()
      .width;
  }

  private updateSliderWrapperSize() {
    requestAnimationFrame(() => {
      const size = this.getSlideSize();
      this.el.style.setProperty("--slide-size", `${size}px`);
    });
  }

  private async wrapItems(items: Recommendation[], columns: number = 1) {
    this.wrappedItems = await rewrapProducts(items, columns);
    this.updateSliderWrapperSize();
  }

  private isPrevAvaible(): boolean {
    return this.slidePosition === 0;
  }

  private isNextAvaible(): boolean {
    return Math.abs(this.slidePosition) === this.wrappedItems.length - 1;
  }

  private prev() {
    this.slidePosition++;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  private next() {
    this.slidePosition--;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  private moveTo(position: number) {
    this.slidePosition = position * -1;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  private isMultipleSlidesAvaible(): boolean {
    return this.wrappedItems.length > 1;
  }

  render() {
    return (
      <Host class={{ minimal: !this.isMultipleSlidesAvaible() }}>
        {this.isMultipleSlidesAvaible() ? (
          <button
            class="prev"
            onClick={() => this.prev()}
            disabled={this.isPrevAvaible()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 512 512"
            >
              <title>previous</title>
              <polyline points="328 112 184 256 328 400" />
            </svg>
          </button>
        ) : null}
        <div class="slides-wrapper">
          <div class="body">
            {this.wrappedItems.map((items) => (
              <div class={{ slide: true, [this.mode]: true }}>
                {items.map((item) => (
                  <vviinn-product-card
                    brand={item.brand}
                    image={item.image.thumbnail ?? item.image.original}
                    imageRatio={this.imageRatio}
                    imageWidth={this.imageWidth}
                    price={item.price.actual}
                    productTitle={item.title}
                    productId={item.productId}
                    productType={item.productType}
                    salePrice={item.price.sale}
                    deeplink={item.deeplink}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        {this.isMultipleSlidesAvaible() ? (
          <button
            class="next"
            onClick={() => this.next()}
            disabled={this.isNextAvaible()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              width="30"
              height="30"
            >
              <title>next</title>
              <polyline points="184 112 328 256 184 400" />
            </svg>
          </button>
        ) : null}
        {this.isMultipleSlidesAvaible() ? (
          <div class="position-bullets">
            {this.wrappedItems.map((_, i) => (
              <div
                class={{
                  "position-bullet": true,
                  active: this.slidePosition === i * -1,
                }}
                onClick={() => this.moveTo(i)}
              ></div>
            ))}
          </div>
        ) : null}
      </Host>
    );
  }
}
