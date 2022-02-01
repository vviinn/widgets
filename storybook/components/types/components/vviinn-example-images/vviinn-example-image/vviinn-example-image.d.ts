import { EventEmitter } from "../../../stencil-public-runtime";
export declare class VviinnExampleImage {
  src: string;
  width: number;
  height: number;
  selected: boolean;
  exampleImageSelected: EventEmitter<void>;
  exampleImageError: EventEmitter<void>;
  private selectImage;
  private showPreloader;
  render(): any;
}
