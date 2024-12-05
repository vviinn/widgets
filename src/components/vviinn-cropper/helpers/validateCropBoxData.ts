import { CropBoxData } from "../types";
import { MIN_SEARCH_AREA_SIZE } from "../constants";

export const ValidateCropBoxData = (cropBoxData: CropBoxData) => {
  const { width, height, left, top } = cropBoxData;
  const minSize = MIN_SEARCH_AREA_SIZE;
  let result = {
    width,
    height,
    left,
    top,
  };

  if (width < minSize) {
    result.width = minSize;
    const deltaX = minSize - width;
    result.left = left - deltaX / 2;
  }
  if (height < minSize) {
    result.height = minSize;
    const deltaY = minSize - height;
    result.top = top - deltaY / 2;
  }

  return result;
};
