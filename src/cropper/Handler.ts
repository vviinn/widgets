import { Point, pointSumSemigroup } from "../geometry/Point";
import { Rectangle } from "../geometry/Rectangle";

export enum HandlerDirection {
  East,
  North,
  NorthEast,
  NorthWest,
  South,
  SouthEast,
  SouthWest,
  West,
}

export const getCursorValue = (direction: HandlerDirection): string => {
  switch (direction) {
    case HandlerDirection.East:
      return "e-resize";
    case HandlerDirection.North:
      return "n-resize";
    case HandlerDirection.NorthEast:
      return "ne-resize";
    case HandlerDirection.NorthWest:
      return "nw-resize";
    case HandlerDirection.South:
      return "s-resize";
    case HandlerDirection.SouthEast:
      return "se-resize";
    case HandlerDirection.SouthWest:
      return "sw-resize";
    case HandlerDirection.West:
      return "w-resize";
    default:
      return "pointer";
  }
};

export interface Handler {
  position: Point;
  readonly direction: HandlerDirection;
}

export const fromRectangle = (r: Rectangle): Handler[] => [
  {
    position: r.position,
    direction: HandlerDirection.NorthWest,
  },
  {
    position: pointSumSemigroup.concat(r.position, { x: r.width * 0.5, y: 0 }),
    direction: HandlerDirection.North,
  },
  {
    position: pointSumSemigroup.concat(r.position, { x: r.width, y: 0 }),
    direction: HandlerDirection.NorthEast,
  },
  {
    position: pointSumSemigroup.concat(r.position, { x: 0, y: r.height * 0.5 }),
    direction: HandlerDirection.West,
  },
  {
    position: pointSumSemigroup.concat(r.position, {
      x: r.width,
      y: r.height * 0.5,
    }),
    direction: HandlerDirection.East,
  },
  {
    position: pointSumSemigroup.concat(r.position, { x: 0, y: r.height }),
    direction: HandlerDirection.SouthWest,
  },
  {
    position: pointSumSemigroup.concat(r.position, {
      x: r.width * 0.5,
      y: r.height,
    }),
    direction: HandlerDirection.South,
  },
  {
    position: pointSumSemigroup.concat(r.position, { x: r.width, y: r.height }),
    direction: HandlerDirection.SouthEast,
  },
];
