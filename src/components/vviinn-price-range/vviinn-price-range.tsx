import { Component, Host, h, Prop, Element, State } from "@stencil/core";
import { components } from "../../interfaces/generated";
import { DynamicFilterValue } from "../../campaign/VPRCampaignService";

export type Histogram = components["schemas"]["interval-filter-values"][];

@Component({
  tag: "vviinn-price-range",
  styleUrl: "vviinn-price-range.css",
  shadow: true,
})
export class VviinnButton {
  @Element() el: HTMLElement;

  @Prop() histogram: Histogram = [];
  @Prop() addStyle: boolean = true;
  @Prop() priceChangeHandler: (filterValue: DynamicFilterValue) => void;

  @State() minIndex: number = 0;
  @State() maxIndex: number;
  @State() scalingFactor: number;

  fromSlider: HTMLElement;
  toSlider: HTMLElement;

  private getParsed(currentFrom: HTMLElement, currentTo: HTMLElement) {
    const from = parseInt((currentFrom as HTMLInputElement).value, 10);
    const to = parseInt((currentTo as HTMLInputElement).value, 10);
    return [from, to];
  }

  componentDidLoad() {
    this.setToggleAccessible(this.toSlider);
  }

  componentWillLoad() {
    this.maxIndex = this.histogram.length - 1;

    const maxValueofFrequency = Math.max(
      ...this.histogram.map(({ value }) => {
        return value.frequency;
      })
    );

    this.scalingFactor = 1 / maxValueofFrequency;
  }

  private controlFromSlider(fromSlider, toSlider) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    if (from > to) {
      fromSlider.value = to;
    }
    this.sendBackValue();
  }

  private controlToSlider(fromSlider, toSlider) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
    } else {
      toSlider.value = from;
    }
    this.sendBackValue();
  }

  private sendBackValue() {
    this.priceChangeHandler({
      interval: {
        start: this.histogram[this.minIndex].value.interval.start,
        end: this.histogram[this.maxIndex].value.interval.end,
      },
    });
  }

  private setToggleAccessible(currentTarget) {
    const toSlider = this.toSlider;
    if (Number(currentTarget.value) <= 0) {
      toSlider.style.zIndex = "2";
    } else {
      toSlider.style.zIndex = "0";
    }
  }

  private calculateBarHeight(frequency: number) {
    return frequency * this.scalingFactor * 100;
  }

  render() {
    const histogramSize = this.histogram.length;

    return (
      <Host>
        <div>
          <div class="histogram">
            {this.histogram.map((item, index) => {
              return (
                <div
                  class={`histogram-bar ${
                    index < this.minIndex || index > this.maxIndex
                      ? "histogram-bar-inactive"
                      : ""
                  }`}
                  style={{
                    height: `${this.calculateBarHeight(item.value.frequency)}%`,
                  }}
                ></div>
              );
            })}
          </div>
          <div class="range_container">
            <div class="sliders_control">
              <input
                ref={(el) => (this.fromSlider = el as HTMLElement)}
                id="fromSlider"
                type="range"
                min="0"
                max={this.histogram.length}
                value="0"
                onInput={(e: Event) => {
                  this.minIndex = parseInt(
                    (e.target as HTMLInputElement).value
                  );
                  this.controlFromSlider(this.fromSlider, this.toSlider);
                }}
              />
              <input
                ref={(el) => (this.toSlider = el as HTMLElement)}
                id="toSlider"
                type="range"
                min="0"
                max={histogramSize}
                value={histogramSize}
                onInput={(e: Event) => {
                  this.maxIndex = parseInt(
                    (e.target as HTMLInputElement).value
                  );
                  this.controlToSlider(this.fromSlider, this.toSlider);
                }}
              />
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
