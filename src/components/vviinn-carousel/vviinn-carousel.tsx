import { Component, Host, h, Element } from '@stencil/core';

@Component({
  tag: 'vviinn-carousel',
  styleUrl: 'vviinn-carousel.css',
  shadow: true,
})
export class VviinnCarousel {
  @Element() el: HTMLElement;

  connectedCallback() {
    const parent = this.el.parentElement;
    const parentStyles = getComputedStyle(parent);
    const parentWidth = parent.getBoundingClientRect().width;
    const width = parentWidth - (parseInt(parentStyles["padding-right"]) + parseInt(parentStyles["padding-left"]));

    this.el.style.setProperty("width", `${width}px`);
  }

  /* private getContent(): Element[] {
*   const slot = this.el.shadowRoot.querySelector("slot");
*   return slot.assignedElements();
* }
 */
  render() {
    return (
      <Host>
        <button class="prev">
          prev
        </button>
        <div class="content-wrapper">
          <div class="content">
            <slot></slot>
          </div>
        </div>
        <button class="next">
          next
        </button>
      </Host>
    );
  }
}
