export const resizeImage = (width: number, i: HTMLImageElement): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const imageWidth = i.naturalWidth;
  const imageHeight = i.naturalHeight;
  const ratio = Math.floor(imageHeight / imageWidth);

  console.log(ratio);

  const newHeight = width * ratio;

  canvas.width = width;
  canvas.height = newHeight;

  ctx.drawImage(i, 0, 0, width, newHeight);

  return canvas.toDataURL();
};
