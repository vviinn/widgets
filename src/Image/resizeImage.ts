import { lanczos } from "@rgba-image/lanczos";
import { dimensionsFromImage, ImageDimension, scaleBySide } from "./sizing";

const createCanvasWithContext = (): [
  HTMLCanvasElement,
  CanvasRenderingContext2D,
] => {
  const canvas = document.createElement("canvas");
  const contenx = canvas.getContext("2d");

  return [canvas, contenx];
};

const imageDataFromImage = (image: HTMLImageElement): ImageData => {
  const { naturalWidth, naturalHeight } = image;
  const [canvas, context] = createCanvasWithContext();

  canvas.width = naturalWidth;
  canvas.height = naturalHeight;

  context.drawImage(image, 0, 0);

  return context.getImageData(0, 0, naturalWidth, naturalHeight);
};

export const resizeImage = (side: number, i: HTMLImageElement): string => {
  const scale = scaleBySide(side, "smallest");

  const [destinationCanvas, destinationContext] = createCanvasWithContext();
  const imageDimensions = dimensionsFromImage(i);
  const [destinationWidth, destinationHeight] = scale(imageDimensions).map(
    (d: ImageDimension) => d.size,
  );

  const destinationImageData = new ImageData(
    destinationWidth,
    destinationHeight,
  );

  const originImageData = imageDataFromImage(i);

  destinationCanvas.width = destinationWidth;
  destinationCanvas.height = destinationHeight;

  lanczos(originImageData, destinationImageData);

  destinationContext.putImageData(destinationImageData, 0, 0);

  return destinationCanvas.toDataURL("image/jpeg", 0.7);
};
