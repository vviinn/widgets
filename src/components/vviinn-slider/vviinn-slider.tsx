import { Component, Host, h, Element, State, Prop, Watch } from "@stencil/core";
import { range } from "fp-ts/lib/NonEmptyArray";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import * as N from "fp-ts/number";
import { sequenceToOption } from "../../utils/option/option";
import { Arrow } from "./arrow";

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

  @Prop() showBullets: boolean = true;
  @Prop({ reflect: true }) position: number = 0;

  @Watch("position")
  positionWatchHandler(newValue: number) {
    this.internalPosition = newValue;
    this.el.style.setProperty("--position", `${newValue}`);
    this.setActiveCssClassToSlide(newValue);
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

  private goToSlide(index: number) {
    this.internalPosition = index;
    this.el.style.setProperty("--position", `${index}`);
    this.setActiveCssClassToSlide(index);
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

  private nextSlide() {
    if (this.internalPosition === this.elementsCount - 1) return;
    this.internalPosition++;
    this.el.style.setProperty("--position", `${this.internalPosition}`);
  }

  private prevSlide() {
    if (this.internalPosition === 0) return;
    this.internalPosition--;
    this.el.style.setProperty("--position", `${this.internalPosition}`);
  }

  private handleKeyDown(event: KeyboardEvent) {
    if (event.key !== "Space" && event.key !== "Enter") return;
    const target = event.target as HTMLElement;
    const targetClass = target.className;

    switch (targetClass) {
      case "prev":
        this.prevSlide();
        break;
      case "next":
        this.nextSlide();
        break;
    }
  }

  private handleTouchStart(event: TouchEvent) {
    if (!this.showBullets) return;

    this.swipeStartPosition = pipe(
      event.touches[0],
      O.fromNullable,
      O.map((t: Touch) => t.clientX)
    );
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.showBullets) return;

    const swipeEndPosition = pipe(
      event.changedTouches[0],
      O.fromNullable,
      O.map((t: Touch) => t.clientX)
    );

    pipe(
      sequenceToOption(this.swipeStartPosition, swipeEndPosition),
      O.map(([start, end]) => N.Ord.compare(start, end)),
      O.map((swipeDirection) =>
        swipeDirection > 0 ? this.nextSlide() : this.prevSlide()
      )
    );
  }

  render() {
    return (
      <Host>
        <div class="items-wrapper">
          <div
            class="items"
            onTouchStart={(e: TouchEvent) => this.handleTouchStart(e)}
            onTouchEnd={(e: TouchEvent) => this.handleTouchEnd(e)}
          >
            <slot></slot>
          </div>
        </div>
        <Arrow
          kind="prev"
          onClick={() => this.prevSlide()}
          onKeyDown={(ev) => this.handleKeyDown(ev)}
          tabindex={1}
          disabled={this.internalPosition === 0}
        />
        <Arrow
          kind="next"
          onClick={() => this.nextSlide()}
          onKeyDown={(ev) => this.handleKeyDown(ev)}
          tabindex={0}
          disabled={this.internalPosition === this.elementsCount - 1}
        />
        {this.renderBullets()}
      </Host>
    );
  }
}
