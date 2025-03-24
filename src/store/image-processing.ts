import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { resizeImage } from "../Image/resizeImage";
import { imageToB64 } from "../Image/imageToB64";
import { convertB64toFileTask } from "../Image/toFile";

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

export const optionalResize = (
  image: HTMLImageElement,
  imageType: ImageType,
) =>
  shouldResize(image, imageType)
    ? resizeImage(imageProcessingConfig[imageType], image)
    : imageToB64(image);

export const processImageToFile =
  (imageType: ImageType) => (image: HTMLImageElement) =>
    pipe(
      TE.right(image),
      TE.map((img) => optionalResize(img, imageType)),
      TE.chainTaskK(convertB64toFileTask),
    );
