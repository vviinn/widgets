import {
  Point,
  fromRectangle,
  pointSumSemigroup,
  pointProductSemigroup,
} from "./Point";
import { Sized, sizedDivSemigroup } from "./Sized";
import { RectangleAlt } from "./RectangleAlt";

export type Rectangle = Point & Sized;

export type ClickEvent = Event & { clientX: number; clientY: number };

export const move = (origin: Rectangle, position: Point): Rectangle => {
  const originPosition = fromRectangle(origin);
  const newPosition = pointSumSemigroup.concat(originPosition, position);

  return {
    ...newPosition,
    width: origin.width,
    height: origin.height,
  };
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
  return {
    x: r.left,
    y: r.top,
    ...r,
  };
};

export const scaleWithSized =
  (s: Sized) =>
  (r: Rectangle): Rectangle => {
    return {
      x: r.x * s.width,
      y: r.y * s.height,
      width: r.width * s.width,
      height: r.height * s.height,
    };
  };

export const divideOnSized =
  (s: Sized) =>
  (r: Rectangle): Rectangle => {
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

export const isClickedInRectBound = (
  event: ClickEvent,
  rect: DOMRect
): boolean => {
  const { clientX, clientY } = event;

  const inLeftBound = clientX >= rect.left;
  const inRightBound = clientX <= rect.right;
  const inTopBound = clientY >= rect.top;
  const inBottomBound = clientY <= rect.bottom;
  return inLeftBound && inRightBound && inTopBound && inBottomBound;
};
