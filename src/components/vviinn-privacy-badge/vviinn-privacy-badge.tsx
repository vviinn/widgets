import { Component, Host, h } from "@stencil/core";

@Component({
  tag: "vviinn-privacy-badge",
  styleUrl: "vviinn-privacy-badge.css",
  shadow: true,
})
export class VviinnPrivacyBadge {
  render() {
    return (
      <Host>
        <slot>
          <div class="content">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none">
              <defs />
              <path fill="#525252" d="M8.5 11V7h-2v1h1v3H6v1h4v-1H8.5zM8 4a.75.75 0 100 1.5A.75.75 0 008 4z" />
              <path fill="#525252" d="M8 15A7 7 0 118 1a7 7 0 010 14zM8 2a6 6 0 100 12A6 6 0 008 2z" />
            </svg>
            <p>
              Wir gehen sorgfältig mit Deinen Daten um. Deine Bilder werden nur zum Zweck der Bildsuche gespeichert.
            </p>
          </div>
        </slot>
      </Host>
    );
  }
}
