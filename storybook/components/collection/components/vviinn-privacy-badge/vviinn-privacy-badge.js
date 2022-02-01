import { Component, Host, h } from "@stencil/core";
export class VviinnPrivacyBadge {
  render() {
    return (h(Host, null,
      h("slot", null,
        h("div", { class: "content" },
          h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "none" },
            h("defs", null),
            h("path", { fill: "#525252", d: "M8.5 11V7h-2v1h1v3H6v1h4v-1H8.5zM8 4a.75.75 0 100 1.5A.75.75 0 008 4z" }),
            h("path", { fill: "#525252", d: "M8 15A7 7 0 118 1a7 7 0 010 14zM8 2a6 6 0 100 12A6 6 0 008 2z" })),
          h("p", null, "Wir gehen sorgf\u00E4ltig mit Deinen Daten um. Deine Bilder werden nur zum Zweck der Bildsuche gespeichert.")))));
  }
  static get is() { return "vviinn-privacy-badge"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["vviinn-privacy-badge.css"]
  }; }
  static get styleUrls() { return {
    "$": ["vviinn-privacy-badge.css"]
  }; }
}
