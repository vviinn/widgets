import { Component, Host, h, Prop, State, Element } from "@stencil/core";

@Component({
  tag: "vviinn-price-range",
  styleUrl: "vviinn-price-range.css",
  shadow: true,
})
export class VviinnButton {
  @Element() el: HTMLElement;

  @Prop() addStyle: boolean = true;

  fromSlider: HTMLElement;
  toSlider: HTMLElement;

  /*private getParsed(currentFrom: HTMLElement, currentTo: HTMLElement) {
    const from = parseInt((currentFrom as HTMLInputElement).value, 10);
    const to = parseInt((currentTo as HTMLInputElement).value, 10);
    return [from, to];
  }*/

  componentDidLoad() {
    this.fillSlider(
      this.fromSlider,
      this.toSlider,
      "#E0E0E0",
      "#000000",
      this.toSlider
    );
  }

  private fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max - to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(fromPosition / rangeDistance) * 100}%,
      ${rangeColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} ${(toPosition / rangeDistance) * 100}%, 
      ${sliderColor} 100%)`;
  }

  private controlFromSlider(fromSlider, toSlider) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    this.fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
    if (from > to) {
      fromSlider.value = to;
    }
  }

  private controlToSlider(fromSlider, toSlider, toInput) {
    const [from, to] = this.getParsed(fromSlider, toSlider);
    fillSlider(fromSlider, toSlider, "#C6C6C6", "#25daa5", toSlider);
    setToggleAccessible(toSlider);
    if (from <= to) {
      toSlider.value = to;
      toInput.value = to;
    } else {
      toInput.value = from;
      toSlider.value = from;
    }
  }

  render() {
    return (
      <Host>
        <div class="range_container">
          <div class="sliders_control">
            <input
              ref={(el) => (this.fromSlider = el as HTMLElement)}
              id="fromSlider"
              type="range"
              value="3"
              min="0"
              max="21"
              onInput={(e: Event) => {
                //console.log(this.fromSlider);
                this.controlFromInput(this.fromSlider, this.toSlider);
              }}
            />
            <input
              ref={(el) => (this.toSlider = el as HTMLElement)}
              id="toSlider"
              type="range"
              value="18"
              min="0"
              max="21"
              onInput={(e: Event) => {
                //this.toSliderValue = (e.target as HTMLInputElement).value;
                this.controlFromSlider();
              }}
            />
          </div>
        </div>
      </Host>
    );
  }
}
