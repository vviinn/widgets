import * as Point from "../geometry/Point";
import { Rectangle } from "../geometry/Rectangle";
export declare enum HandlerDirection {
  East = 0,
  North = 1,
  NorthEast = 2,
  NorthWest = 3,
  South = 4,
  SouthEast = 5,
  SouthWest = 6,
  West = 7
}
export declare const getCursorValue: (direction: HandlerDirection) => string;
export interface Handler {
  position: Point.Point;
  readonly direction: HandlerDirection;
}
export declare const fromRectangle: (r: Rectangle) => Handler[];
