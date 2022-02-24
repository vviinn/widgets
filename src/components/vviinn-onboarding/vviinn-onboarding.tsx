import { Component, Host, h, Element } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-onboarding",
  styleUrl: "vviinn-onboarding.css",
  shadow: true,
})
export class VviinnOnboarding {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="vviinn-onboarding-title">
          <h3>So funktioniert es</h3>
        </slot>
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
