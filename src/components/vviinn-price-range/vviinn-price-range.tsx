import { Component, Host, h, Prop, Element, State, Watch } from "@stencil/core";
import { components } from "../../interfaces/generated";
import { priceRangeParts } from "../../cssParts";

export type Histogram = components["schemas"]["interval-filter-values"][];

const MIN_BAR_HEIGHT = 3;

/**
 * @part histogram - Wrapper itself.
 * @part histogram-bar - Bar of the histogram.
 * @part histogram-range-container - Container for the range sliders.
 * @part histogram-sliders-control - Container for the range sliders control.
 * @part histogram-from-slider - Slider for the minimum value.
 * @part histogram-to-slider - Slider for the maximum value.
 * @part histogram-label-wrapper - Wrapper for the labels.
 * @part histogram-label - Label for the histogram.
 */

@Component({
  tag: "vviinn-price-range",
  styleUrl: "vviinn-price-range.css",
  shadow: true,
})
export class VviinnButton {
  @Element() el: HTMLElement;

  @Prop() histogram: Histogram = [];
  @Prop() addStyle: boolean = true;
  @Prop() priceChangeHandler: (
    filterValue: components["schemas"]["interval-filter-value-item"]
  ) => void;
  @Prop() selectedInterval?: components["schemas"]["interval"];
  @Prop() currencySign: string;

  @State() minIndex: number = 0;
  @State() maxIndex: number;
  @State() scalingFactor: number;

  fromSlider: HTMLInputElement;
  toSlider: HTMLInputElement;

  componentWillLoad() {
    this.updatingSelectedInterval();
  }

  @Watch("selectedInterval")
  updatingSelectedInterval() {
    this.maxIndex = this.histogram.length - 1;

    const maxValueofFrequency = Math.max(
      ...this.histogram.map(({ value }) => {
        return value.frequency;
      })
    );

    this.scalingFactor = 100 / maxValueofFrequency;

    if (this.selectedInterval.start !== undefined) {
      this.minIndex = this.histogram.findIndex(
        ({ value }) => value.interval.start === this.selectedInterval.start
      );
    } else {
      this.minIndex = 0;
    }

    if (this.selectedInterval.end) {
      this.maxIndex = this.histogram.findIndex(
        (item) => item.value.interval.end === this.selectedInterval.end
      );
    } else {
      this.maxIndex = this.histogram.length - 1;
    }
  }

  private controlFromSlider(e: InputEvent) {
    const fromValue = parseInt((e.target as HTMLInputElement).value);

    if (fromValue >= this.maxIndex) {
      this.minIndex = this.maxIndex - 1; // Set it just below max index
    } else {
      this.minIndex = fromValue;
    }

    (e.target as HTMLInputElement).value = String(this.minIndex);
  }

  private controlToSlider(e: InputEvent) {
    const toValue = parseInt((e.target as HTMLInputElement).value);

    if (toValue <= this.minIndex) {
      this.maxIndex = this.minIndex + 1;
    } else {
      this.maxIndex = toValue;
    }

    (e.target as HTMLInputElement).value = String(this.maxIndex);
  }

  private sendBackValue() {
    this.priceChangeHandler({
      interval: {
        start: this.histogram[this.minIndex]?.value?.interval?.start,
        end: this.histogram[this.maxIndex]?.value?.interval?.end,
      },
    });
  }
  private calculateBarHeight(frequency: number) {
    return frequency * this.scalingFactor;
  }

  render() {
    const histogramSize = this.histogram.length - 1;

    return (
      <Host exportparts={priceRangeParts}>
        <div class="histogram" part="histogram">
          {this.histogram.map((item, index) => {
            const barHeight = this.calculateBarHeight(item.value.frequency);
            return (
              <div
                class={`histogram-bar ${
                  index < this.minIndex || index > this.maxIndex
                    ? "histogram-bar-inactive"
                    : ""
                }`}
                style={{
                  height: `${
                    barHeight && barHeight < MIN_BAR_HEIGHT
                      ? MIN_BAR_HEIGHT
                      : barHeight
                  }%`,
                }}
                part="histogram-bar"
              ></div>
            );
          })}
        </div>
        <div class="range_container" part="histogram-range-container">
          <div class="sliders_control" part="histogram-sliders-control">
            <input
              ref={(el) => (this.fromSlider = el as HTMLInputElement)}
              id="fromSlider"
              type="range"
              min="0"
              max={histogramSize}
              value={this.minIndex}
              onInput={(e: InputEvent) => {
                this.controlFromSlider(e);
              }}
              onChange={() => this.sendBackValue()}
              part="histogram-from-slider"
            />
            <input
              ref={(el) => (this.toSlider = el as HTMLInputElement)}
              id="toSlider"
              type="range"
              min="0"
              max={histogramSize}
              value={this.maxIndex}
              onInput={(e: InputEvent) => {
                this.controlToSlider(e);
              }}
              onChange={() => this.sendBackValue()}
              part="histogram-to-slider"
            />
          </div>
        </div>
        <div class="label-wrapper" part="histogram-label-wrapper">
          <div class="label" part="histogram-label">
            {this.histogram[this.minIndex]?.value?.interval?.start}
            <span class="histogram-currency">{this.currencySign}</span>
          </div>
          <div class="label" part="histogram-label">
            {this.histogram[this.maxIndex]?.value?.interval?.end}
            <span class="histogram-currency">{this.currencySign}</span>
          </div>
        </div>
      </Host>
    );
  }
}
