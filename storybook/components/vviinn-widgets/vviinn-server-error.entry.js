import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';

const vviinnServerErrorCss = ":host{display:block}";

let VviinnServerError = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.actionClick = createEvent(this, "actionClick", 7);
  }
  render() {
    return (h(Host, null, h("vviinn-error", null, h("h4", { slot: "title" }, "Keine Verbindung"), h("span", { slot: "text" }, "Etwas hat leider nicht funktioniert. Bitte pr\u00FCfen Sie Ihre Internetverbindung und laden Sie das Bild noch einmal hoch."), h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Erneut versuchen"))));
  }
};
VviinnServerError.style = vviinnServerErrorCss;

export { VviinnServerError as vviinn_server_error };
