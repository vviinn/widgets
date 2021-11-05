import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-onboarding",
  styleUrl: "vviinn-onboarding.css",
  shadow: false,
})
export class VviinnOnboarding {
  render() {
    return (
      <Host>
        <h3>So funktioniert es</h3>
        <vviinn-slider showArrows={true}>
          <vviinn-slide>
            <vviinn-onboarding-card-1 />
          </vviinn-slide>
          <vviinn-slide>
            <vviinn-onboarding-card-2 />
          </vviinn-slide>
          <vviinn-slide>
            <vviinn-onboarding-card-3 />
          </vviinn-slide>
        </vviinn-slider>
      </Host >
    );
  }
}
