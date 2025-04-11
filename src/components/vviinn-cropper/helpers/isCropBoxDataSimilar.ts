import { Rectangle } from "../../../interfaces/search";

export const isCropBoxDataSimilar = (
  cropBoxData1: Rectangle,
  cropBoxData2: Rectangle,
  positionThreshold = 0.5,
) => {
  const { left: x1, top: y1, width: w1, height: h1 } = cropBoxData1;
  const { left: x2, top: y2, width: w2, height: h2 } = cropBoxData2;

  const positionDiffX = Math.abs(x1 - x2);
  const positionDiffY = Math.abs(y1 - y2);
  const sizeDiffWidth = Math.abs(w1 - w2);
  const sizeDiffHeight = Math.abs(h1 - h2);

  return (
    positionDiffX <= positionThreshold &&
    positionDiffY <= positionThreshold &&
    sizeDiffWidth <= positionThreshold &&
    sizeDiffHeight <= positionThreshold
  );
};
