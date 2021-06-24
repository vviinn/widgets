import { Rectangle } from "../geometry/Rectangle";

export const resizeImage = (
  width: number,
  i: HTMLImageElement
): [string, Rectangle] => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageWidth = i.naturalWidth;
  const imageHeight = i.naturalHeight;
  const ratio = imageHeight / imageWidth;
  const height = width * ratio;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(i, 0, 0, width, height);

  const imageRectangle = {
    x: 0,
    y: 0,
    width,
    height,
  };

  return [canvas.toDataURL(), imageRectangle];
};
