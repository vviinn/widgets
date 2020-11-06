import {
  Component,
  Host,
  h,
  Element,
  State,
  Method,
  Listen,
} from "@stencil/core";
import { Interfaces } from "../../interfaces/recommendation";
import { chunksOf } from "fp-ts/lib/Array";

@Component({
  tag: "vpr-slider",
  styleUrl: "vpr-slider.css",
  shadow: true,
})
export class VprSlider {
  @Element() el: HTMLElement;

  @State() items: Interfaces["VisualProductSearch"][] = [];
  @State() columns: number = 1;
  @State() wrappedItems: Interfaces["VisualProductSearch"][][] = [[]];

  private slidesWrapper: HTMLElement;
  private slidePosition: number = 0;

  @Listen("resize", { target: "window" })
  resizeHandler() {
    this.updateColumns();
    this.updateSliderWrapperSize();
  }

  componentDidRender() {
    this.updateSliderWrapperSize();
  }

  componentWillLoad() {
    this.updateColumns();
  }

  @Method()
  async loadKek(x: Interfaces["VisualProductSearch"][]) {
    this.items = x;
    this.wrapItems(this.items);
  }

  getColumnsValue(): number {
    return parseInt(getComputedStyle(this.el).getPropertyValue("--columns"));
  }

  updateColumns() {
    const newColumns = this.getColumnsValue();

    if (newColumns !== this.columns) {
      this.columns = newColumns;
      this.wrapItems(this.items);
    }
  }

  getSlideSize(): number {
    return this.slidesWrapper.getBoundingClientRect().width;
  }

  updateSliderWrapperSize() {
    setTimeout(() => {
      this.el.style.setProperty("--slide-size", `${this.getSlideSize()}px`);
    });
  }

  wrapItems(items: Interfaces["VisualProductSearch"][]) {
    this.wrappedItems = chunksOf(this.columns)(items);
  }

  prev() {
    if (this.slidePosition > 0) {
      this.slidePosition++;
      this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
    }
  }

  next() {
    if (this.slidePosition < this.wrappedItems.length) {
      this.slidePosition--;
      this.el.style.setProperty("--slide-position", `${this.slidePosition}`);
    }
  }

  render() {
    return (
      <Host>
        <div class="prev" onClick={() => this.prev()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 512 512"
          >
            <title>previous</title>
            <polyline points="328 112 184 256 328 400" />
          </svg>
        </div>
        <div class="body" ref={(el) => (this.slidesWrapper = el)}>
          {this.wrappedItems.map((items) => (
            <div class="slide">
              {items.map((item) => (
                <vpr-result item={item} imageWidth={100} imageRatio={1.5} />
              ))}
            </div>
          ))}
        </div>
        <div class="next" onClick={() => this.next()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            width="30"
            height="30"
          >
            <title>next</title>
            <polyline points="184 112 328 256 184 400" />
          </svg>
        </div>
      </Host>
    );
  }
}
