import {
  Point,
  fromRectangle,
  pointSumSemigroup,
  pointProductSemigroup,
} from "./Point";
import { Handler, HandlerDirection } from "../cropper/Handler";
import { Sized, sizedDivSemigroup } from "./Sized";
import { RectangleAlt } from "./RectangleAlt";

export type Rectangle = Point & Sized;

interface RectangleTransform {
  (x: Rectangle, y: Handler): Rectangle;
}

export const move = (origin: Rectangle, position: Point): Rectangle => {
  const originPosition = fromRectangle(origin);
  const newPosition = pointSumSemigroup.concat(originPosition, position);

  return {
    ...newPosition,
    width: origin.width,
    height: origin.height,
  };
};

const transformNorthEast: RectangleTransform = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: 0,
    y: handler.position.y,
  });

  return {
    ...newPosition,
    width: origin.width + handler.position.x,
    height: origin.height - handler.position.y,
  };
};

export const transformNorthWest = (
  origin: Rectangle,
  handler: Handler
): Rectangle => {
  const newPosition = pointSumSemigroup.concat(
    fromRectangle(origin),
    handler.position
  );

  return {
    ...newPosition,
    width: origin.width - handler.position.x,
    height: origin.height - handler.position.y,
  };
};

const transformNorth: RectangleTransform = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: 0,
    y: handler.position.y,
  });

  return {
    ...newPosition,
    width: origin.width,
    height: origin.height - handler.position.y,
  };
};

const transformEast: RectangleTransform = (origin, handler) => {
  return {
    ...origin,
    width: origin.width + handler.position.x,
    height: origin.height,
  };
};

const transformWest: RectangleTransform = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: handler.position.x,
    y: 0,
  });

  return {
    ...newPosition,
    width: origin.width - handler.position.x,
    height: origin.height,
  };
};

const transformSouth: RectangleTransform = (origin, handler) => {
  return {
    ...origin,
    width: origin.width,
    height: origin.height + handler.position.y,
  };
};

const transformSouthEast: RectangleTransform = (origin, handler) => {
  return {
    ...origin,
    width: origin.width + handler.position.x,
    height: origin.height + handler.position.y,
  };
};

const transformSouthWest = (origin: Rectangle, handler: Handler): Rectangle => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: handler.position.x,
    y: 0,
  });

  return {
    ...newPosition,
    width: origin.width - handler.position.x,
    height: origin.height + handler.position.y,
  };
};

export const transform: RectangleTransform = (origin, handler) => {
  switch (handler.direction) {
    case HandlerDirection.North:
      return transformNorth(origin, handler);
    case HandlerDirection.NorthEast:
      return transformNorthEast(origin, handler);
    case HandlerDirection.NorthWest:
      return transformNorthWest(origin, handler);
    case HandlerDirection.East:
      return transformEast(origin, handler);
    case HandlerDirection.West:
      return transformWest(origin, handler);
    case HandlerDirection.South:
      return transformSouth(origin, handler);
    case HandlerDirection.SouthEast:
      return transformSouthEast(origin, handler);
    case HandlerDirection.SouthWest:
      return transformSouthWest(origin, handler);
  }
};

export const fromImage = (image: HTMLImageElement): Rectangle => {
  return {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  };
};

export const fromNaturalImage = (image: HTMLImageElement): Rectangle => {
  return {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};

export const getScaleRange = (source: Rectangle, target: Rectangle): Point => {
  const difference = sizedDivSemigroup.concat(target, source);
  return {
    x: difference.width,
    y: difference.height,
  };
};

export const scaleSelection = (
  source: Rectangle,
  sourceSelection: Rectangle,
  target: Rectangle
): Rectangle => {
  const sourcePosition = fromRectangle(source);
  const scale = getScaleRange(source, target);
  const newPosition = pointProductSemigroup.concat(sourcePosition, scale);

  return {
    ...newPosition,
    width: sourceSelection.width * scale.x,
    height: sourceSelection.height * scale.y,
  };
};

export const fromAlt = (r: RectangleAlt): Rectangle => {
  const { width, height } = r;

  return {
    x: r.left,
    y: r.top,
    width,
    height,
  };
};

export const scaleWithSized = (s: Sized) => (r: Rectangle): Rectangle => {
  return {
    x: r.x * s.width,
    y: r.y * s.height,
    width: r.width * s.width,
    height: r.height * s.height,
  };
};

export const divideOnSized = (s: Sized) => (r: Rectangle): Rectangle => {
  return {
    x: r.x / s.width,
    y: r.y / s.height,
    width: r.width / s.width,
    height: r.height / s.height,
  };
};

export const center = (r: Rectangle): Point => {
  return {
    x: r.x + r.width * 0.5,
    y: r.y + r.height * 0.5,
  };
};
