import { Component, Host, Prop, h } from "@stencil/core";

@Component({
  tag: "vviinn-energy-label",
  styleUrl: "vviinn-energy-label.css",
  shadow: true,
})
export class VviinnEnergyLabel {
  @Prop() energyEfficiencyClass: string = "A";
  @Prop() minEnergyEfficiencyClass: string = "G";
  @Prop() maxEnergyEfficiencyClass: string = "A";

  render() {
    return (
      <Host>
        <svg
          width="64"
          height="40"
          viewBox="0 0 64 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="label-shape">
            <mask id="path-1-inside-1_1635_3740" fill="white">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M49 0H0V40H49L64 20L49 0Z"
              />
            </mask>
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M49 0H0V40H49L64 20L49 0Z"
              fill="#BED62F"
            />
            <path
              d="M0 0V-1H-1V0H0ZM49 0L49.8 -0.6L49.5 -1H49V0ZM0 40H-1V41H0V40ZM49 40V41H49.5L49.8 40.6L49 40ZM64 20L64.8 20.6L65.25 20L64.8 19.4L64 20ZM0 1H49V-1H0V1ZM1 40V0H-1V40H1ZM49 39H0V41H49V39ZM63.2 19.4L48.2 39.4L49.8 40.6L64.8 20.6L63.2 19.4ZM48.2 0.6L63.2 20.6L64.8 19.4L49.8 -0.6L48.2 0.6Z"
              fill="black"
              mask="url(#path-1-inside-1_1635_3740)"
            />
          </g>
        </svg>

        <div class="range-block">
          <span>{this.maxEnergyEfficiencyClass}</span>
          <svg
            width="6"
            height="5"
            viewBox="0 0 6 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 4.11759L3.00474 0.764648L0 4.11759" fill="#17191D" />
          </svg>
          <span>{this.minEnergyEfficiencyClass}</span>
        </div>

        <div class="energy-efficiency-container">
          <span>{this.energyEfficiencyClass}</span>
        </div>
      </Host>
    );
  }
}
