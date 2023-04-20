import { Component, Host, h, Element } from "@stencil/core";
import { OnboardingCard3Icon } from "../../../vviinn-icons";
import { slotChangeListener } from "../../../customized-slots";

@Component({
  tag: "vviinn-onboarding-card-3",
  styleUrl: "../onboarding-card.css",
  shadow: true,
})
export class VviinnOnboardingCard3 {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="onboarding-card-3-icon">
          <OnboardingCard3Icon />
        </slot>
        <slot name="onboarding-card-3-text">
          <div class="text">
            <h4>Ohne Hintergrund</h4>
            <p>
              Die besten Ergebnisse erhältst Du, wenn das gesuchte Objekt mit
              einfarbigem und hellem Hintergrund zu sehen ist.
            </p>
          </div>
        </slot>
      </Host>
    );
  }
}
