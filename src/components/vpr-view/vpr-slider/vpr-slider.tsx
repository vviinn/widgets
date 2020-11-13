import {
  Component,
  Host,
  h,
  Element,
  State,
  Method,
  Listen,
  Prop,
} from "@stencil/core";
import { Interfaces } from "../../../interfaces/recommendation";
import { chunksOf } from "fp-ts/lib/Array";
import { GridMode } from "../GridMode";

@Component({
  tag: "vpr-slider",
  styleUrl: "vpr-slider.css",
  shadow: true,
})
export class VprSlider {
  @Element() el: HTMLElement;

  @Prop() mode: GridMode;
  @Prop() imageRatio: number = 1.5;
  @Prop() imageWidth: number = 150;

  @State() columns: number = 1;
  @State() wrappedItems: Interfaces["VisualProductSearch"][][] = [[]];
  @State() slidePosition: number = 0;

  private slidesWrapper: HTMLElement;

  @Listen("resize", { target: "window" })
  resizeHandler() {
    const products = this.wrappedItems.flat();
    this.wrapItems(products, this.getColumnsValue());
  }

  componentShouldUpdate() {
    this.updateSliderWrapperSize();
  }

  componentDidLoad() {
    this.updateSliderWrapperSize();
  }

  @Method()
  async loadProducts(products: Interfaces["VisualProductSearch"][]) {
    this.wrapItems(products, this.getColumnsValue());
  }

  getColumnsValue(): number {
    return parseInt(getComputedStyle(this.el).getPropertyValue("--columns"));
  }

  getSlideSize(): number {
    return this.slidesWrapper.getBoundingClientRect().width;
  }

  updateSliderWrapperSize() {
    const size = this.getSlideSize();
    this.el.style.setProperty("--slide-size", `${size}px`);
  }

  wrapItems(items: Interfaces["VisualProductSearch"][], columns: number = 1) {
    if (this.mode === "grid") {
      this.wrappedItems = chunksOf(columns)(items);
    } else {
      const slideSize = this.getSlideSize();
      const margin = parseInt(
        getComputedStyle(this.el).getPropertyValue("font-size")
      );

      const avaibleColumns = Math.floor(slideSize / (this.imageWidth + margin));

      this.wrappedItems = chunksOf(avaibleColumns)(items);
    }
  }

  isPrevAvaible(): boolean {
    return this.slidePosition === 0;
  }

  isNextAvaible(): boolean {
    return Math.abs(this.slidePosition) === this.wrappedItems.length - 1;
  }

  prev() {
    this.slidePosition++;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  next() {
    this.slidePosition--;
    this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
  }

  render() {
    return (
      <Host>
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
        <div class="slides-wrapper" ref={(el) => (this.slidesWrapper = el)}>
          <div class="body">
            {this.wrappedItems.map((items) => (
              <div class="slide">
                {items.map((item) => (
                  <vpr-result item={item} imageWidth={100} imageRatio={1.5} />
                ))}
              </div>
            ))}
          </div>
        </div>
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
      </Host>
    );
  }
}
