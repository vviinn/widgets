export const imageToB64 = (i) => {
  const canvas = document.createElement("canvas");
  const { naturalWidth, naturalHeight } = i;
  const ctx = canvas.getContext("2d");
  canvas.width = naturalWidth;
  canvas.height = naturalHeight;
  ctx.drawImage(i, 0, 0, naturalWidth, naturalHeight);
  return canvas.toDataURL();
};
