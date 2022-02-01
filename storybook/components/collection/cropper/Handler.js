import * as Point from "../geometry/Point";
export var HandlerDirection;
(function (HandlerDirection) {
  HandlerDirection[HandlerDirection["East"] = 0] = "East";
  HandlerDirection[HandlerDirection["North"] = 1] = "North";
  HandlerDirection[HandlerDirection["NorthEast"] = 2] = "NorthEast";
  HandlerDirection[HandlerDirection["NorthWest"] = 3] = "NorthWest";
  HandlerDirection[HandlerDirection["South"] = 4] = "South";
  HandlerDirection[HandlerDirection["SouthEast"] = 5] = "SouthEast";
  HandlerDirection[HandlerDirection["SouthWest"] = 6] = "SouthWest";
  HandlerDirection[HandlerDirection["West"] = 7] = "West";
})(HandlerDirection || (HandlerDirection = {}));
export const getCursorValue = (direction) => {
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
export const fromRectangle = (r) => [
  {
    position: Point.fromRectangle(r),
    direction: HandlerDirection.NorthWest,
  },
  {
    position: Point.pointSumSemigroup.concat(Point.fromRectangle(r), {
      x: r.width,
      y: 0,
    }),
    direction: HandlerDirection.NorthEast,
  },
  {
    position: Point.pointSumSemigroup.concat(Point.fromRectangle(r), {
      x: 0,
      y: r.height,
    }),
    direction: HandlerDirection.SouthWest,
  },
  {
    position: Point.pointSumSemigroup.concat(Point.fromRectangle(r), {
      x: r.width,
      y: r.height,
    }),
    direction: HandlerDirection.SouthEast,
  },
];
