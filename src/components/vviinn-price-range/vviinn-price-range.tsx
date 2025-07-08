import { Component, Host, h, Prop, Element, State, Watch } from "@stencil/core";
import i18next from "i18next";
import { components } from "../../interfaces/generated";
import { priceRangeParts } from "../../cssParts";
import { globalState } from "../../store/store";

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
export class VviinnPriceRange {
  @Element() el: HTMLElement;

  @Prop() histogram: Histogram = [];
  @Prop() addStyle: boolean = true;
  @Prop() priceChangeHandler: (
    filterValue: components["schemas"]["interval-filter-value-item"],
  ) => void;
  @Prop() selectedInterval?: components["schemas"]["interval"];

  @State() scalingFactor: number;
  @State() minValue: number;
  @State() maxValue: number;
  @State() fromValue: number;
  @State() toValue: number;

  fromSlider: HTMLInputElement;
  toSlider: HTMLInputElement;

  componentWillLoad() {
    this.initializeValues();
  }

  @Watch("selectedInterval")
  @Watch("histogram")
  initializeValues() {
    if (!this.histogram || this.histogram.length === 0) {
      return;
    }

    this.minValue = this.histogram[0].value.interval.start;
    this.maxValue =
      this.histogram[this.histogram.length - 1].value.interval.end;

    if (this.selectedInterval) {
      this.fromValue = this.selectedInterval.start ?? this.minValue;
      this.toValue = this.selectedInterval.end ?? this.maxValue;
    } else {
      this.fromValue = this.minValue;
      this.toValue = this.maxValue;
    }

    const maxValueofFrequency = Math.max(
      ...this.histogram.map(({ value }) => value.frequency),
    );
    this.scalingFactor = 100 / maxValueofFrequency;
  }

  private controlFromSlider = (e: InputEvent) => {
    const newFromValue = parseInt((e.target as HTMLInputElement).value);

    if (newFromValue >= this.toValue) {
      this.fromValue = this.toValue - 1;
      (e.target as HTMLInputElement).value = String(this.fromValue);
    } else {
      this.fromValue = newFromValue;
    }
  };

  private controlToSlider = (e: InputEvent) => {
    const newToValue = parseInt((e.target as HTMLInputElement).value);

    if (newToValue <= this.fromValue) {
      this.toValue = this.fromValue + 1;
      (e.target as HTMLInputElement).value = String(this.toValue);
    } else {
      this.toValue = newToValue;
    }
  };

  private sendBackValue = () => {
    this.priceChangeHandler({
      interval: {
        start: this.fromValue,
        end: this.toValue,
      },
    });
  };

  private calculateBarHeight(frequency: number) {
    return frequency * this.scalingFactor;
  }

  private isBarActive(item: Histogram[number]): boolean {
    if (!item.active) return false;

    const { start, end } = item.value.interval;
    return !(end < this.fromValue || start > this.toValue);
  }

  render() {
    return (
      <Host exportparts={priceRangeParts}>
        <div class="histogram" part="histogram">
          {this.histogram.map((item) => {
            const barHeight = this.calculateBarHeight(item.value.frequency);
            const heightInPercent =
              barHeight && barHeight < MIN_BAR_HEIGHT
                ? MIN_BAR_HEIGHT
                : barHeight;

            const isActive = this.isBarActive(item);
            console.log(isActive, item);
            return (
              <div
                class={`histogram-bar ${
                  !isActive ? "histogram-bar-inactive" : ""
                }`}
                style={{
                  height: `${heightInPercent}%`,
                }}
                part="histogram-bar"
              ></div>
            );
          })}
        </div>
        <div class="range_container" part="histogram-range-container">
          <div class="sliders_control" part="histogram-sliders-control">
            <input
              ref={(el) => (this.fromSlider = el)}
              id="fromSlider"
              type="range"
              min={this.minValue}
              max={this.maxValue}
              value={this.fromValue}
              onInput={this.controlFromSlider}
              onChange={this.sendBackValue}
              step={1}
              part="histogram-from-slider"
              aria-label={i18next.t("a11y.priceRangeMin")}
            />
            <input
              ref={(el) => (this.toSlider = el)}
              id="toSlider"
              type="range"
              min={this.minValue}
              max={this.maxValue}
              value={this.toValue}
              onInput={this.controlToSlider}
              onChange={this.sendBackValue}
              step={1}
              part="histogram-to-slider"
              aria-label={i18next.t("a11y.priceRangeMax")}
            />
          </div>
        </div>
        <div class="label-wrapper" part="histogram-label-wrapper">
          <div class="label" part="histogram-label">
            {this.fromValue}
            <span class="histogram-currency">{globalState.currencySign}</span>
          </div>
          <div class="label" part="histogram-label">
            {this.toValue}
            <span class="histogram-currency">{globalState.currencySign}</span>
          </div>
        </div>
      </Host>
    );
  }
}
