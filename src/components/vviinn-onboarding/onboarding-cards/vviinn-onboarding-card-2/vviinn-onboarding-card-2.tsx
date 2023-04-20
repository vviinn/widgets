import { Component, Host, h, Element } from "@stencil/core";
import { OnboardingCard2Icon } from "../../../vviinn-icons";
import { slotChangeListener } from "../../../customized-slots";

@Component({
  tag: "vviinn-onboarding-card-2",
  styleUrl: "../onboarding-card.css",
  shadow: true,
})
export class VviinnOnboardingCard2 {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="onboarding-card-2-icon">
          <OnboardingCard2Icon />
        </slot>
        <slot name="onboarding-card-2-text">
          <div class="text">
            <h4>Verfeiner deine Suche</h4>
            <p>
              Du kannst den Bildrahmen selber festlegen und so die Produkte
              genau auswählen.
            </p>
          </div>
        </slot>
      </Host>
    );
  }
}
