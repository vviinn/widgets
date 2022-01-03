import { lanczos } from "@rgba-image/lanczos";

const createCanvasWithContext = (): [
  HTMLCanvasElement,
  CanvasRenderingContext2D
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

const getImageAspectRatio = (image: HTMLImageElement): number => {
  const { naturalWidth, naturalHeight } = image;

  return naturalHeight / naturalWidth;
};

export const resizeImage = (width: number, i: HTMLImageElement): string => {
  const aspectRatio = getImageAspectRatio(i);
  const [destinationCanvas, destinationContext] = createCanvasWithContext();
  const destinationImageData = new ImageData(width, width * aspectRatio);
  const originImageData = imageDataFromImage(i);

  destinationCanvas.width = width;
  destinationCanvas.height = width * aspectRatio;

  lanczos(originImageData, destinationImageData);

  destinationContext.putImageData(destinationImageData, 0, 0);

  return destinationCanvas.toDataURL();
};
