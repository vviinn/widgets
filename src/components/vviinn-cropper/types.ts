import { Rectangle } from "../../geometry/Rectangle";

export type CropBoxData = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type SearchArea = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type LoadImageEventData = {
  imageBounds: Rectangle;
  searchArea: SearchArea;
};
