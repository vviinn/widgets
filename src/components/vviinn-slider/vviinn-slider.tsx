import { Component, Host, h, Element, State, Prop, Watch } from "@stencil/core";
import * as O from "fp-ts/lib/Option";

@Component({
  tag: "vviinn-slider",
  styleUrl: "vviinn-slider.css",
  shadow: true,
})
export class VviinnSlider {
  @Element() el: HTMLElement;

  @State() elementsCount: number = 0;
  @State() internalPosition: number = 0;
  @State() swipeStartPosition: O.Option<number> = O.none;
  @State() isRTL: boolean = false;

  @Prop({ reflect: true }) position: number = 0;

  @Watch("position")
  positionWatchHandler(newValue: number) {
    this.internalPosition = newValue;
    this.el.style.setProperty(
      "--position",
      `${this.calculatePosition(newValue)}`
    );
    this.setActiveCssClassToSlide(newValue);
  }

  componentWillLoad() {
    this.isRTL = document.dir === "rtl";
  }

  connectedCallback() {
    this.handleDomContentChanges();
  }

  private handleDomContentChanges() {
    const items = this.el.querySelectorAll("vviinn-slide");
    this.elementsCount = items.length;
    this.el.style.setProperty("--num-items", `${this.elementsCount}`);
    this.setActiveCssClassToSlide(0);
  }

  private setActiveCssClassToSlide(index: number) {
    const items = this.el.querySelectorAll("vviinn-slide");
    items.forEach((i) => i.classList.remove("active"));
    items[index].classList.add("active");
  }

  private calculatePosition(position: number) {
    return this.isRTL ? position * -1 : position;
  }

  render() {
    return (
      <Host>
        <div class="items-wrapper">
          <div class="items">
            <slot></slot>
          </div>
        </div>
      </Host>
    );
  }
}
