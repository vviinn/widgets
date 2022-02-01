import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';

const vviinnWrongFormatCss = ":host{display:block}";

let VviinnWrongFormat = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.actionClick = createEvent(this, "actionClick", 7);
  }
  render() {
    return (h(Host, null, h("vviinn-error", null, h("h4", { slot: "title" }, "Dateityp wird nicht unterst\u00FCtzt"), h("span", { slot: "text" }, "Leider unterst\u00FCtzen wir dieses Format nicht. Bitte laden Sie eine .jpg, .png oder .webp Bilddatei hoch."), h("button", { slot: "action", onClick: () => this.actionClick.emit() }, "Neues Bild hochladen"))));
  }
};
VviinnWrongFormat.style = vviinnWrongFormatCss;

export { VviinnWrongFormat as vviinn_wrong_format };
