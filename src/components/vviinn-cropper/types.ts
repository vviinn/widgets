import { Rectangle } from "../../interfaces";

export type CropBoxData = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type LoadImageEventData = {
  imageBounds: Rectangle;
};

export type CropEndEventData = {
  searchArea: Rectangle;
  normalizedSearchArea: Rectangle;
  imageBounds: Rectangle;
  requestId?: string;
};
