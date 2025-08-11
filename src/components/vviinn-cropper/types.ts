import { Rectangle } from "../../interfaces";

export type CropBoxData = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type LoadImageEventData = {
  imageBounds: Rectangle;
  searchArea?: Rectangle;
};
