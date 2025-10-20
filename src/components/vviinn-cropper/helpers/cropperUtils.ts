import Cropper from "cropperjs";
import { Rectangle } from "../../../interfaces";

export const getCropBoxData = (cropper: Cropper): Rectangle => {
  const { left, top, width, height } = cropper.getCropBoxData();
  return { left, top, width, height };
};
