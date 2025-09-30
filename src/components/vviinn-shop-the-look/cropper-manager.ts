import Cropper from "cropperjs";
import { cropperOptions } from "../vviinn-cropper/constants";
import { Rectangle } from "../../interfaces/search";
import { divideOnSized } from "../../geometry/Rectangle";
import { isCropBoxChangeMinimal } from "../vviinn-cropper/helpers/isCropBoxDataSimilar";
import { getCropBoxData } from "../vviinn-cropper/helpers/cropperUtils";

export interface CropperManagerConfig {
  onCropEnd: (cropArea: Rectangle, imageIndex: number) => void;
}

export class CropperManager {
  private cropperInstances: Map<number, Cropper> = new Map();
  private startCropBoxData: Map<number, Rectangle> = new Map();
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
      cropstart: () => this.handleCropStart(cropper, index),
      cropend: () => this.handleCropEnd(cropper, index),
    });

    this.cropperInstances.set(index, cropper);
  }

  private handleCropStart(cropper: Cropper, imageIndex: number) {
    this.startCropBoxData.set(imageIndex, getCropBoxData(cropper));
  }

  private handleCropEnd(cropper: Cropper, imageIndex: number) {
    const currentCropBoxData = getCropBoxData(cropper);
    const startCropBoxData = this.startCropBoxData.get(imageIndex);

    if (
      startCropBoxData &&
      isCropBoxChangeMinimal(startCropBoxData, currentCropBoxData)
    ) {
      return;
    }

    const imageData = cropper.getImageData();

    const adjustedCropBox: Rectangle = {
      left: currentCropBoxData.left - imageData.left,
      top: currentCropBoxData.top - imageData.top,
      width: currentCropBoxData.width,
      height: currentCropBoxData.height,
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

  updateCropperDimensions(
    index: number,
    getImageElement: (index: number) => HTMLImageElement | null,
  ) {
    const cropper = this.cropperInstances.get(index);
    if (cropper) {
      cropper.destroy();
      this.cropperInstances.delete(index);

      const imageElement = getImageElement(index);
      if (
        imageElement &&
        imageElement.complete &&
        imageElement.offsetWidth > 0
      ) {
        this.initializeCropper(imageElement, index, index);
      }
    }
  }
}
