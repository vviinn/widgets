import { Component, Host, h, Listen, Element } from '@stencil/core';
import { OnboardingCard1Icon } from '../../../vviinn-icons';

@Component({
  tag: 'vviinn-onboarding-card-1',
  styleUrl: '../onboarding-card.css',
  shadow: true,
})
export class VviinnOnboardingCard1 {
  @Element() el: HTMLElement;

  @Listen("globalSlotsChanged", { target: "window" })
  handleSlotsChange(ev: any) {
    const slots = Array.from(this.el.shadowRoot.querySelectorAll("slot"));
    const slotNames = slots.map(node => node.getAttribute("name"));

    ev.detail.forEach((globalSlot: HTMLElement, index: number) => {
      const globalSlotName = globalSlot.getAttribute("slot");

      if (slotNames.includes(globalSlotName)) {
        const target = slots[index];
        target.innerHTML = globalSlot.outerHTML;
        globalSlot.hidden = false;
      }
    });
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
