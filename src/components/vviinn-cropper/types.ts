import { Rectangle } from "../../interfaces/search";

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
