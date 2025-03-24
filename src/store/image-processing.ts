import { pipe } from "fp-ts/lib/function";
import * as TE from "fp-ts/lib/TaskEither";
import { resizeImage } from "../Image/resizeImage";
import { imageToB64 } from "../Image/imageToB64";
import { convertB64toFileTask } from "../Image/toFile";

const IMAGE_SMALLEST_SIDE_TO_RESIZE = 800;
const HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE = 2000;

interface ImageProcessingConfig {
  previewSize: number;
  hiResSize: number;
}

export const imageProcessingConfig: ImageProcessingConfig = {
  previewSize: IMAGE_SMALLEST_SIDE_TO_RESIZE,
  hiResSize: HI_RES_IMAGE_SMALLEST_SIDE_TO_RESIZE,
};

export const shouldResize = (image: HTMLImageElement, size: number) =>
  Math.min(image.naturalWidth, image.naturalHeight) > size;

export const optionalResize = (image: HTMLImageElement, size: number) =>
  shouldResize(image, size) ? resizeImage(size, image) : imageToB64(image);

export const processImageToFile = (size: number) => (image: HTMLImageElement) =>
  pipe(
    TE.right(image),
    TE.map((img) => optionalResize(img, size)),
    TE.chainTaskK(convertB64toFileTask),
  );
