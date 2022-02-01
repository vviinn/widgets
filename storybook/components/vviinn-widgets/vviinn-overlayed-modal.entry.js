import { r as registerInstance, k as createEvent, h, f as Host } from './index-42e4cfd6.js';

const vviinnOverlayedModalCss = ":host{display:none}:host(.active){display:block}vviinn-overlay{align-items:center;display:grid;justify-items:center}@media (max-width: 415px){vviinn-modal{border-radius:4px 4px 0 0;height:100vh;margin-top:32px;transform:translateY(100%);width:100vw}vviinn-overlay{align-items:end;display:grid;justify-items:center}}";

let VviinnOverlayedModal = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.secondaryActionClicked = createEvent(this, "secondaryActionClicked", 7);
    this.modalClosed = createEvent(this, "modalClosed", 7);
    this.active = false;
  }
  render() {
    return (h(Host, { class: { active: this.active } }, h("vviinn-overlay", null, h("vviinn-modal", { onSecondaryActionClicked: () => this.secondaryActionClicked.emit(), active: this.active }, h("slot", null, "CONTENT")))));
  }
};
VviinnOverlayedModal.style = vviinnOverlayedModalCss;

export { VviinnOverlayedModal as vviinn_overlayed_modal };
