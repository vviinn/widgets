import { Component, Host, h, Listen, Element } from '@stencil/core';
import { OnboardingCard3Icon } from '../../../vviinn-icons';

@Component({
  tag: 'vviinn-onboarding-card-3',
  styleUrl: '../onboarding-card.css',
  shadow: true,
})
export class VviinnOnboardingCard3 {
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
