import { Component, Host, h, Element, State, Prop, Watch } from "@stencil/core";
import { range } from "fp-ts/lib/Array";

@Component({
  tag: "vviinn-slider",
  styleUrl: "vviinn-slider.css",
  shadow: true,
})
export class VviinnSlider {
  @Element() el: HTMLElement;

  @State() elementsCount: number = 0;
  @State() internalPosition: number = 0;

  @Prop() showBullets: boolean = true;
  @Prop({ reflect: true }) position: number = 0;

  @Watch('position')
  positionWatchHandler(newValue: number) {
    this.internalPosition = newValue;
    this.el.style.setProperty("--position", `${newValue}`);
  }

  componentDidLoad() {
    const items = this.el.querySelectorAll("vviinn-slide");
    this.elementsCount = items.length;
    this.el.style.setProperty("--num-items", `${this.elementsCount}`);
  }

  private goToSlide(index: number) {
    this.internalPosition = index;
    this.el.style.setProperty("--position", `${index}`);
  }

  private renderBullets() {
    return this.showBullets ? (
      <div class="controls">
        {range(0, this.elementsCount - 1).map((i) => (
          <div
            class={{ bullet: true, active: i == this.internalPosition }}
            onClick={() => this.goToSlide(i)}
          ></div>
        ))}
      </div>
    ) : null;
  }

  render() {
    return (
      <Host>
        <div class="items-wrapper">
          <div class="items">
            <slot></slot>
          </div>
        </div>
        {this.renderBullets()}
      </Host>
    );
  }
}
