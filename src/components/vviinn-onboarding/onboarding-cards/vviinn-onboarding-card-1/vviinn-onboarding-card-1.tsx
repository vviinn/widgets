import { Component, Host, h, Element } from "@stencil/core";
import { slotChangeListener } from "../../../customized-slots";
import { OnboardingCard1Icon } from "../../../vviinn-icons";

@Component({
  tag: "vviinn-onboarding-card-1",
  styleUrl: "../onboarding-card.css",
  shadow: true,
})
export class VviinnOnboardingCard1 {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot name="onboarding-card-1-icon">
          <OnboardingCard1Icon />
        </slot>
        <slot name="onboarding-card-1-text">
          <div class="text">
            <h4>Starte die Bildsuche</h4>
            <p>
              Lade ein Bild aus Deiner Galerie hoch oder fotografiere ein
              Produkt mit Deiner Kamera.
            </p>
          </div>
        </slot>
      </Host>
    );
  }
}
