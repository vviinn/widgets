import {
  dimensionsFromImage,
  ImageDimension,
  scaleByLargestSide,
} from "./sizing";

import { createCanvasWithContext } from "../canvas";

const imageDataFromImage = (image: HTMLImageElement): ImageData => {
  const { naturalWidth, naturalHeight } = image;
  const [canvas, context] = createCanvasWithContext();

  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, naturalWidth, naturalHeight);
};

export const prepareImageForResizing =
  (width: number) =>
  (i: HTMLImageElement): [ImageData, ImageData] => {
    const scale = scaleByLargestSide(width);
    const destinationCanvas = document.createElement("canvas");
    const imageDimensions = dimensionsFromImage(i);
    const [destinationWidth, destinationHeight] = scale(imageDimensions).map(
      (d: ImageDimension) => d.size
    );

    const destinationImageData = new ImageData(
      destinationWidth,
      destinationHeight
    );

    const originImageData = imageDataFromImage(i);

    destinationCanvas.width = destinationWidth;
    destinationCanvas.height = destinationHeight;

    return [originImageData, destinationImageData];
  };
