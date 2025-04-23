import { resizeImage } from "../Image/resizeImage";
import { imageToB64 } from "../Image/imageToB64";

const IMAGE_SMALLEST_SIDE_TO_RESIZE = 800;
const HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE = 2000;

export type ImageType = "image" | "highResolutionImage";
export type ImageProcessingConfig = Record<ImageType, number>;

export const imageProcessingConfig: ImageProcessingConfig = {
  image: IMAGE_SMALLEST_SIDE_TO_RESIZE,
  highResolutionImage: HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE,
};

export const shouldResize = (image: HTMLImageElement, imageType: ImageType) =>
  Math.min(image.naturalWidth, image.naturalHeight) >
  imageProcessingConfig[imageType];

export const optionalResize = async (
  image: HTMLImageElement,
  imageType: ImageType,
) =>
  shouldResize(image, imageType)
    ? resizeImage(imageProcessingConfig[imageType], image)
    : await imageToB64(image);
