import { EventEmitter } from "../../stencil-public-runtime";
export declare class VviinnExampleImages {
  el: HTMLElement;
  imageSelected: EventEmitter<void>;
  imageSelectedError: EventEmitter<void>;
  handleImageSelection(): void;
  handleImageSelectionError(): void;
  componentWillLoad(): void;
  render(): any;
}
