import Cropper from "cropperjs";
import { cropperOptions } from "../vviinn-cropper/constants";
import { Rectangle } from "../../interfaces/search";
import { divideOnSized } from "../../geometry/Rectangle";

export interface CropperManagerConfig {
  onCropEnd: (cropArea: Rectangle, imageIndex: number) => void;
}

export class CropperManager {
  private cropperInstances: Map<number, Cropper> = new Map();
  private config: CropperManagerConfig;

  constructor(config: CropperManagerConfig) {
    this.config = config;
  }

  initializeCropper(
    imageElement: HTMLImageElement,
    index: number,
    activeIndex: number,
  ) {
    if (index !== activeIndex) {
      return;
    }

    if (this.cropperInstances.has(index)) {
      this.cropperInstances.get(index)?.destroy();
    }

    const cropper = new Cropper(imageElement, {
      ...cropperOptions,
      cropend: () => this.handleCropEnd(cropper, index),
      ready: () => {},
    });

    this.cropperInstances.set(index, cropper);
  }

  private handleCropEnd(cropper: Cropper, imageIndex: number) {
    const cropBoxData = cropper.getCropBoxData();
    const imageData = cropper.getImageData();

    const adjustedCropBox: Rectangle = {
      left: cropBoxData.left - imageData.left,
      top: cropBoxData.top - imageData.top,
      width: cropBoxData.width,
      height: cropBoxData.height,
    };

    const normalizedCropArea = divideOnSized({
      width: imageData.width,
      height: imageData.height,
    })(adjustedCropBox);

    this.config.onCropEnd(normalizedCropArea, imageIndex);
  }

  activateCropperForSlide(
    activeIndex: number,
    getImageElement: (index: number) => HTMLImageElement | null,
  ) {
    this.cropperInstances.forEach((cropper, index) => {
      if (index !== activeIndex) {
        cropper.destroy();
        this.cropperInstances.delete(index);
      }
    });

    if (!this.cropperInstances.has(activeIndex)) {
      const imageElement = getImageElement(activeIndex);
      if (
        imageElement &&
        imageElement.complete &&
        imageElement.offsetWidth > 0
      ) {
        this.initializeCropper(imageElement, activeIndex, activeIndex);
      }
    }
  }

  destroyAll() {
    this.cropperInstances.forEach((cropper) => cropper.destroy());
    this.cropperInstances.clear();
  }

  hasCropper(index: number): boolean {
    return this.cropperInstances.has(index);
  }
}
