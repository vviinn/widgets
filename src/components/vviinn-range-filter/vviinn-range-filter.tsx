import { Component, Host, h, Prop, Element, State, Watch } from "@stencil/core";
import i18next from "i18next";
import {
  IntervalFilterValueItem,
  IntervalFilterValue,
  Interval,
} from "../../interfaces";
import { priceRangeParts } from "../../cssParts";
import { globalState } from "../../store/store";
import { slotChangeListener } from "../customized-slots";

export type Histogram = IntervalFilterValue[];

const MIN_BAR_HEIGHT = 3;
const MIN_SLIDER_MARGIN_PERCENT = 0.03; // 3% of total range
const DIGITS_ONLY_REGEX = /[^\d]/g;

/**
 * @slot vviinn-range-filter-from-label - Label text for the "From" input field.
 * @slot vviinn-range-filter-to-label - Label text for the "To" input field.
 *
 * @part histogram - Wrapper itself.
 * @part histogram-bar - Bar of the histogram.
 * @part histogram-range-container - Container for the range sliders.
 * @part histogram-sliders-control - Container for the range sliders control.
 * @part histogram-from-slider - Slider for the minimum value.
 * @part histogram-to-slider - Slider for the maximum value.
 * @part histogram-label-wrapper - Wrapper for the labels/inputs.
 * @part histogram-label - Label for the histogram (when showInputs is false).
 * @part histogram-input-container - Container for the input field (when showInputs is true).
 * @part histogram-input-label - Label text for the input (From/Till).
 * @part histogram-from-input - Input field for the minimum value.
 * @part histogram-to-input - Input field for the maximum value.
 */

@Component({
  tag: "vviinn-range-filter",
  styleUrl: "vviinn-range-filter.css",
  shadow: true,
})
export class VviinnPriceRange {
  @Element() el: HTMLElement;

  @Prop() histogram: Histogram = [];
  @Prop() intervalChangeHandler: (filterValue: IntervalFilterValueItem) => void;
  @Prop() selectedInterval?: Interval;
  @Prop() showCurrency: boolean = true;
  /** Show editable input fields instead of readonly labels */
  @Prop() showIntervalInputs: boolean = false;
  /** The currency sign displayed after price values */
  @Prop() currencySign?: string;

  @State() scalingFactor: number;
  @State() minValue: number;
  @State() maxValue: number;
  @State() fromValue: number;
  @State() toValue: number;

  componentWillLoad() {
    slotChangeListener(this, this.el);
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

  private clampAndEnforceMargin = (
    value: number,
    type: "from" | "to",
  ): number => {
    let clampedValue = Math.max(this.minValue, Math.min(this.maxValue, value));

    if (type === "from") {
      clampedValue = Math.min(clampedValue, this.toValue - this.minMargin);
    } else {
      clampedValue = Math.max(clampedValue, this.fromValue + this.minMargin);
    }

    return clampedValue;
  };

  private controlSlider = (e: InputEvent, type: "from" | "to") => {
    const target = e.target as HTMLInputElement;
    const newValue = parseInt(target.value);
    const clampedValue = this.clampAndEnforceMargin(newValue, type);

    if (type === "from") {
      this.fromValue = clampedValue;
    } else {
      this.toValue = clampedValue;
    }

    target.value = String(clampedValue);
  };

  private sendBackValue = () => {
    this.intervalChangeHandler({
      interval: {
        start: this.fromValue,
        end: this.toValue,
      },
    });
  };

  private calculateInputSize = (value: string | number): number => {
    return Math.max(String(value).length, 1);
  };

  private setCursorToEnd = (input: HTMLInputElement) => {
    input.setSelectionRange(input.value.length, input.value.length);
  };

  private handleInputChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const value = target.value.replace(DIGITS_ONLY_REGEX, "");
    target.value = value;
    target.size = this.calculateInputSize(value);
  };

  private handleInputBlur = (e: Event, type: "from" | "to") => {
    const target = e.target as HTMLInputElement;
    const numericValue = target.value.replace(DIGITS_ONLY_REGEX, "");
    const defaultValue = type === "from" ? this.minValue : this.maxValue;

    let parsedValue = parseInt(numericValue);
    if (isNaN(parsedValue)) parsedValue = defaultValue;

    const clampedValue = this.clampAndEnforceMargin(parsedValue, type);

    if (type === "from") {
      this.fromValue = clampedValue;
    } else {
      this.toValue = clampedValue;
    }

    target.value = String(clampedValue);
    target.size = this.calculateInputSize(clampedValue);
    this.sendBackValue();
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

  private renderValueDisplay = (
    value: number,
    type: "from" | "to",
    labelKey: string,
    ariaLabelKey: string,
    slotName: string,
  ) => {
    if (this.showIntervalInputs) {
      return (
        <div
          class="input-container"
          part="histogram-input-container"
          onClick={(e) => {
            const container = e.currentTarget as HTMLElement;
            const input = container.querySelector(
              ".value-input",
            ) as HTMLInputElement;
            if (input && e.target !== input) {
              input.focus();
              this.setCursorToEnd(input);
            }
          }}
        >
          <span class="input-label" part="histogram-input-label">
            <slot name={slotName}>{i18next.t(labelKey)}</slot>
          </span>
          <div class="input-value-wrapper">
            <input
              type="text"
              class="value-input"
              part={`histogram-${type}-input`}
              value={value}
              size={this.calculateInputSize(value)}
              onInput={this.handleInputChange}
              onBlur={(e) => this.handleInputBlur(e, type)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.target as HTMLInputElement).blur();
                }
              }}
              aria-label={i18next.t(ariaLabelKey)}
            />
            {this.showCurrency && (
              <span class="input-currency">{this.currencySign ?? globalState.currencySign}</span>
            )}
          </div>
        </div>
      );
    }

    return (
      <div class="label" part="histogram-label">
        {value}
        {this.showCurrency && (
          <span class="histogram-currency">{this.currencySign ?? globalState.currencySign}</span>
        )}
      </div>
    );
  };

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
                class={{
                  "histogram-bar": true,
                  "histogram-bar-inactive": !isActive,
                }}
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
              id="fromSlider"
              type="range"
              min={this.minValue}
              max={this.maxValue}
              step={1}
              value={this.fromValue}
              onInput={(e) => this.controlSlider(e, "from")}
              onChange={this.sendBackValue}
              part="histogram-from-slider"
              aria-label={i18next.t("a11y.priceRangeMin")}
            />
            <input
              id="toSlider"
              type="range"
              min={this.minValue}
              max={this.maxValue}
              step={1}
              value={this.toValue}
              onInput={(e) => this.controlSlider(e, "to")}
              onChange={this.sendBackValue}
              part="histogram-to-slider"
              aria-label={i18next.t("a11y.priceRangeMax")}
            />
          </div>
        </div>
        <div
          class={{
            "label-wrapper": true,
            "with-inputs": this.showIntervalInputs,
          }}
          part="histogram-label-wrapper"
        >
          {this.renderValueDisplay(
            this.fromValue,
            "from",
            "filters.from",
            "a11y.priceRangeMin",
            "vviinn-range-filter-from-label",
          )}
          {this.renderValueDisplay(
            this.toValue,
            "to",
            "filters.till",
            "a11y.priceRangeMax",
            "vviinn-range-filter-to-label",
          )}
        </div>
      </Host>
    );
  }
}
