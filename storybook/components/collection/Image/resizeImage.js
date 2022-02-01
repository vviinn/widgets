import { lanczos } from "@rgba-image/lanczos";
import { dimensionsFromImage, scaleByLargestSide, } from "./sizing";
const createCanvasWithContext = () => {
  const canvas = document.createElement("canvas");
  const contenx = canvas.getContext("2d");
  return [canvas, contenx];
};
const imageDataFromImage = (image) => {
  const { naturalWidth, naturalHeight } = image;
  const [canvas, context] = createCanvasWithContext();
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  context.drawImage(image, 0, 0);
  return context.getImageData(0, 0, naturalWidth, naturalHeight);
};
export const resizeImage = (width, i) => {
  const scale = scaleByLargestSide(width);
  const [destinationCanvas, destinationContext] = createCanvasWithContext();
  const imageDimensions = dimensionsFromImage(i);
  const [destinationWidth, destinationHeight] = scale(imageDimensions).map((d) => d.size);
  const destinationImageData = new ImageData(destinationWidth, destinationHeight);
  const originImageData = imageDataFromImage(i);
  destinationCanvas.width = destinationWidth;
  destinationCanvas.height = destinationHeight;
  lanczos(originImageData, destinationImageData);
  destinationContext.putImageData(destinationImageData, 0, 0);
  return destinationCanvas.toDataURL();
};
