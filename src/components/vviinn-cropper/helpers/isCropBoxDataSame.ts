import { Rectangle } from "../../../interfaces/search";

export const isCropBoxDataSame = (
  cropBoxData1: Rectangle,
  cropBoxData2: Rectangle,
  positionThreshold = 0.2,
) => {
  const { left: left1, top: top1 } = cropBoxData1;
  const { left: left2, top: top2 } = cropBoxData2;
  const isLeftSame = Math.abs(left1 - left2) < positionThreshold;
  const isTopSame = Math.abs(top1 - top2) < positionThreshold;

  return isLeftSame && isTopSame;
};
