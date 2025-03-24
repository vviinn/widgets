import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { resizeImage } from "../Image/resizeImage";
import { imageToB64 } from "../Image/imageToB64";
import { convertB64toFileTask } from "../Image/toFile";

const IMAGE_SMALLEST_SIDE_TO_RESIZE = 800;
const HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE = 2000;

export type ImageSize = "preview" | "hiRes";
export type ImageProcessingConfig = Record<ImageSize, number>;

export const imageProcessingConfig: ImageProcessingConfig = {
  preview: IMAGE_SMALLEST_SIDE_TO_RESIZE,
  hiRes: HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE,
};

export const shouldResize = (image: HTMLImageElement, imageSize: ImageSize) =>
  Math.min(image.naturalWidth, image.naturalHeight) >
  imageProcessingConfig[imageSize];

export const optionalResize = (
  image: HTMLImageElement,
  imageSize: ImageSize,
) =>
  shouldResize(image, imageSize)
    ? resizeImage(imageProcessingConfig[imageSize], image)
    : imageToB64(image);

export const processImageToFile =
  (imageSize: ImageSize) => (image: HTMLImageElement) =>
    pipe(
      TE.right(image),
      TE.map((img) => optionalResize(img, imageSize)),
      TE.chainTaskK(convertB64toFileTask),
    );
