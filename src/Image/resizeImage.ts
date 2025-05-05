import { lanczos } from "@rgba-image/lanczos";
import { dimensionsFromImage, ImageDimension, scaleBySide } from "./sizing";
import { blobToBase64, canvasToBlob, drawImageToCanvas } from "./imageToB64";

export const resizeImageToBlob = async (
  side: number,
  img: HTMLImageElement,
  quality = 0.7,
): Promise<Blob> => {
  const scale = scaleBySide(side, "smallest");
  const [canvas, ctx] = createCanvas();
  const [destWidth, destHeight] = scale(dimensionsFromImage(img)).map(
    (d: ImageDimension) => d.size,
  );

  const originImageData = getImageData(img);
  const destImageData = new ImageData(destWidth, destHeight);

  canvas.width = destWidth;
  canvas.height = destHeight;

  lanczos(originImageData, destImageData);
  ctx.putImageData(destImageData, 0, 0);

  return canvasToBlob(canvas, quality);
};

export const resizeImageToBase64 = async (
  side: number,
  img: HTMLImageElement,
  quality = 0.7,
): Promise<string> => {
  const blob = await resizeImageToBlob(side, img, quality);
  return blobToBase64(blob);
};

const createCanvas = (): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Failed to get canvas context");
  return [canvas, context];
};

const getImageData = (img: HTMLImageElement): ImageData => {
  const [_, ctx] = drawImageToCanvas(img);
  return ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight);
};
