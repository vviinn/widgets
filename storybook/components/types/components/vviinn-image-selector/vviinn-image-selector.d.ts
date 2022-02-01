import { EventEmitter } from "../../stencil-public-runtime";
/**
 * @part button -  button look and feel
 */
export declare class VviinnImageSelector {
  /** Event fires when user select file */
  imageSelected: EventEmitter<void>;
  /** Event fires when user select file that no .jpg, .jpeg or png */
  imageSelectedError: EventEmitter<void>;
  private handleInputChange;
  private isLoading;
  render(): any;
}
