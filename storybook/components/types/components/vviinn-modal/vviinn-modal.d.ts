import { EventEmitter } from "../../stencil-public-runtime";
export declare class VviinnModal {
  active: boolean;
  slider: boolean;
  /** Event emitted when close button clicked and close animation ends */
  modalClosed: EventEmitter<AnimationEvent>;
  /** Event emitted when secondary action button clicked */
  secondaryActionClicked: EventEmitter<void>;
  private close;
  private handleAnimationEnd;
  render(): any;
}
