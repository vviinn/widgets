import { Point, pointSumSemigroup } from "./Point";
import { Handler, HandlerDirection } from "../cropper/Handler";

export interface Rectangle {
  readonly position: Point;
  readonly width: number;
  readonly height: number;
}

export interface Rectangular {
  readonly kind: "rectangle",
  readonly position: Point;
  readonly width: number;
  readonly height: number;
}

export function of(r: Rectangle): Rectangular {
    return {
        kind: "rectangle",
        ...r
    }
}

interface RectangleTransform {
  (x: Rectangle, y: Handler): Rectangle;
}

export const move = (origin: Rectangle, position: Point): Rectangle => {
  return {
    position: pointSumSemigroup.concat(origin.position, position),
    width: origin.width,
    height: origin.height,
  };
};

const transformNorthEast: RectangleTransform = (origin, handler) => {
  return {
    position: pointSumSemigroup.concat(origin.position, {
      x: 0,
      y: handler.position.y,
    }),
    width: origin.width + handler.position.x,
    height: origin.height - handler.position.y,
  };
};

export const transformNorthWest = (
  origin: Rectangle,
  handler: Handler
): Rectangle => {
  return {
    position: pointSumSemigroup.concat(origin.position, {
      x: handler.position.x,
      y: handler.position.y,
    }),
    width: origin.width - handler.position.x,
    height: origin.height - handler.position.y,
  };
};

const transformNorth: RectangleTransform = (origin, handler) => {
  return {
    position: pointSumSemigroup.concat(origin.position, {
      x: 0,
      y: handler.position.y,
    }),
    width: origin.width,
    height: origin.height - handler.position.y,
  };
};

const transformEast: RectangleTransform = (origin, handler) => {
  return {
    position: origin.position,
    width: origin.width + handler.position.x,
    height: origin.height,
  };
};

const transformWest: RectangleTransform = (origin, handler) => {
  return {
    position: pointSumSemigroup.concat(origin.position, {
      x: handler.position.x,
      y: 0,
    }),
    width: origin.width - handler.position.x,
    height: origin.height,
  };
};

const transformSouth: RectangleTransform = (origin, handler) => {
  return {
    position: origin.position,
    width: origin.width,
    height: origin.height + handler.position.y,
  };
};

const transformSouthEast: RectangleTransform = (origin, handler) => {
  return {
    position: origin.position,
    width: origin.width + handler.position.x,
    height: origin.height + handler.position.y,
  };
};

const transformSouthWest = (origin: Rectangle, handler: Handler): Rectangle => {
  return {
    position: pointSumSemigroup.concat(origin.position, {
      x: handler.position.x,
      y: 0,
    }),
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
    position: {
      x: 0,
      y: 0,
    },
    width: image.width,
    height: image.height,
  };
};

export const fromNaturalImage = (image: HTMLImageElement): Rectangle => {
  return {
    position: {
      x: 0,
      y: 0,
    },
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};

const getScaleRange = (source: Rectangle, target: Rectangle): Point => {
  return {
    x: target.width / source.width,
    y: target.height / source.height,
  };
};

export const scaleSelection = (
  source: Rectangle,
  sourceSelection: Rectangle,
  target: Rectangle
): Rectangle => {
  const scale = getScaleRange(source, target);

  return {
    position: {
      x: sourceSelection.position.x * scale.x,
      y: sourceSelection.position.y * scale.y,
    },
    width: sourceSelection.width * scale.x,
    height: sourceSelection.height * scale.y,
  };
};
