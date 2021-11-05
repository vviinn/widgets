import { Component, Host, h, Listen, Element } from '@stencil/core';
import { OnboardingCard2Icon } from '../../../vviinn-icons';

@Component({
  tag: 'vviinn-onboarding-card-2',
  styleUrl: '../onboarding-card.css',
  shadow: true,
})
export class VviinnOnboardingCard2 {
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
