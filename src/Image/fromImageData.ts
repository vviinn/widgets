import { createCanvasWithContext } from "../canvas";

export const fromImageData = (data: ImageData): HTMLCanvasElement => {
  const [canvas, context] = createCanvasWithContext();

  canvas.width = data.width;
  canvas.height = data.height;

  context.putImageData(data, 0, 0);

  return canvas;
};
