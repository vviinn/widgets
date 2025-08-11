import { Component, Host, h, Prop, Element, State, Watch } from "@stencil/core";
import i18next from "i18next";
import {
  IntervalFilterValueItem,
  IntervalFilterValue,
  Interval,
} from "../../interfaces";
import { priceRangeParts } from "../../cssParts";
import { globalState } from "../../store/store";

export type Histogram = IntervalFilterValue[];

const MIN_BAR_HEIGHT = 3;
const MIN_SLIDER_MARGIN_PERCENT = 0.03; // 3% of total range

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
  tag: "vviinn-range-filter",
  styleUrl: "vviinn-range-filter.css",
  shadow: true,
})
export class VviinnPriceRange {
  @Element() el: HTMLElement;

  @Prop() histogram: Histogram = [];
  @Prop() addStyle: boolean = true;
  @Prop() intervalChangeHandler: (filterValue: IntervalFilterValueItem) => void;
  @Prop() selectedInterval?: Interval;
  @Prop() showCurrency: boolean = true;

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
    const target = e.target as HTMLInputElement;
    const newFromValue = parseInt(target.value);

    if (newFromValue >= this.toValue - this.minMargin) {
      this.fromValue = this.toValue - this.minMargin;
      target.value = String(this.fromValue);
    } else {
      this.fromValue = newFromValue;
    }
  };

  private controlToSlider = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    const newToValue = parseInt(target.value);

    if (newToValue <= this.fromValue + this.minMargin) {
      this.toValue = this.fromValue + this.minMargin;
      target.value = String(this.toValue);
    } else {
      this.toValue = newToValue;
    }
  };

  private sendBackValue = () => {
    this.intervalChangeHandler({
      interval: {
        start: this.fromValue,
        end: this.toValue,
      },
    });
  };

  private get minMargin(): number {
    const totalRange = this.maxValue - this.minValue;
    return Math.max(1, Math.round(totalRange * MIN_SLIDER_MARGIN_PERCENT));
  }

  private calculateBarHeight(frequency: number) {
    return frequency * this.scalingFactor;
  }

  private isBarActive(item: Histogram[number]): boolean {
    if (!item.active) return false;

    const { start, end } = item.value.interval;
    return !(end < this.fromValue || start > this.toValue);
  }

  private calculateBarWidth(item: Histogram[number]): number {
    const { start, end } = item.value.interval;
    const intervalWidth = end - start;
    const totalRange = this.maxValue - this.minValue;
    return (intervalWidth / totalRange) * 100;
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
            const widthInPercent = this.calculateBarWidth(item);

            const isActive = this.isBarActive(item);
            return (
              <div
                class={`histogram-bar ${
                  !isActive ? "histogram-bar-inactive" : ""
                }`}
                style={{
                  height: `${heightInPercent}%`,
                  width: `${widthInPercent}%`,
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
              step={1}
              value={this.fromValue}
              onInput={this.controlFromSlider}
              onChange={this.sendBackValue}
              part="histogram-from-slider"
              aria-label={i18next.t("a11y.priceRangeMin")}
            />
            <input
              ref={(el) => (this.toSlider = el)}
              id="toSlider"
              type="range"
              min={this.minValue}
              max={this.maxValue}
              step={1}
              value={this.toValue}
              onInput={this.controlToSlider}
              onChange={this.sendBackValue}
              part="histogram-to-slider"
              aria-label={i18next.t("a11y.priceRangeMax")}
            />
          </div>
        </div>
        <div class="label-wrapper" part="histogram-label-wrapper">
          <div class="label" part="histogram-label">
            {this.fromValue}
            {this.showCurrency && (
              <span class="histogram-currency">{globalState.currencySign}</span>
            )}
          </div>
          <div class="label" part="histogram-label">
            {this.toValue}
            {this.showCurrency && (
              <span class="histogram-currency">{globalState.currencySign}</span>
            )}
          </div>
        </div>
      </Host>
    );
  }
}
