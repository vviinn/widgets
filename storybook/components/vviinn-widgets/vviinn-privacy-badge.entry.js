import { r as registerInstance, h, f as Host } from './index-42e4cfd6.js';

const vviinnPrivacyBadgeCss = ":host{display:block;background:#F4F4F4;padding:17px}.content{display:grid;grid-template-columns:-webkit-min-content auto;grid-template-columns:min-content auto;grid-gap:9px}.content p{color:#525252;font-size:12px;line-height:16px;margin:unset}";

let VviinnPrivacyBadge = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
  }
  render() {
    return (h(Host, null, h("slot", null, h("div", { class: "content" }, h("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", fill: "none" }, h("defs", null), h("path", { fill: "#525252", d: "M8.5 11V7h-2v1h1v3H6v1h4v-1H8.5zM8 4a.75.75 0 100 1.5A.75.75 0 008 4z" }), h("path", { fill: "#525252", d: "M8 15A7 7 0 118 1a7 7 0 010 14zM8 2a6 6 0 100 12A6 6 0 008 2z" })), h("p", null, "Wir gehen sorgf\u00E4ltig mit Deinen Daten um. Deine Bilder werden nur zum Zweck der Bildsuche gespeichert.")))));
  }
};
VviinnPrivacyBadge.style = vviinnPrivacyBadgeCss;

export { VviinnPrivacyBadge as vviinn_privacy_badge };
