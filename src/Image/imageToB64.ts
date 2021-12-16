export const imageToB64 = (i: HTMLImageElement): string => {
  const canvas = document.createElement("canvas");

  canvas.width = i.naturalWidth;
  canvas.height = i.naturalHeight;
  const ctx = canvas.getContext("2d");

  ctx.drawImage(i, 0, 0, i.naturalWidth, i.naturalHeight);

  return canvas.toDataURL();
};
