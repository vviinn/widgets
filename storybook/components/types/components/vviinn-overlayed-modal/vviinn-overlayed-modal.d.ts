import { EventEmitter } from "../../stencil-public-runtime";
export declare class VviinnOverlayedModal {
  active: boolean;
  secondaryActionClicked: EventEmitter<void>;
  modalClosed: EventEmitter<void>;
  render(): any;
}
