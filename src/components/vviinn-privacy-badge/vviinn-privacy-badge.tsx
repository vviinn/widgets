import { Component, Host, h, Element } from "@stencil/core";
import { slotChangeListener } from "../customized-slots";

@Component({
  tag: "vviinn-privacy-badge",
  styleUrl: "vviinn-privacy-badge.css",
  shadow: true,
})
export class VviinnPrivacyBadge {
  @Element() el: HTMLElement;

  componentWillLoad() {
    slotChangeListener(this, this.el);
  }

  render() {
    return (
      <Host>
        <slot>
          <div class="content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="none"
            >
              <defs />
              <path
                fill="#525252"
                d="M8.5 11V7h-2v1h1v3H6v1h4v-1H8.5zM8 4a.75.75 0 100 1.5A.75.75 0 008 4z"
              />
              <path
                fill="#525252"
                d="M8 15A7 7 0 118 1a7 7 0 010 14zM8 2a6 6 0 100 12A6 6 0 008 2z"
              />
            </svg>
            <slot name="vviinn-privacy-badge-text">
              <p>
                Durch das Hochladen eines Bildes willigst Du in die Verarbeitung
                durch unseren Partner Vviinn ein. Das Bild wird nach einer
                Stunde Inaktivität gelöscht.
              </p>
            </slot>
          </div>
        </slot>
      </Host>
    );
  }
}
