import {
  Point,
  fromRectangle,
  pointSumSemigroup,
  pointProductSemigroup,
} from "./Point";
import { Sized, sizedDivSemigroup } from "./Sized";
import { Rectangle } from "../interfaces";

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
    left: 0,
    top: 0,
    width: image.width,
    height: image.height,
  };
};

export const fromRenderedImage = (
  image: HTMLImageElement | null | undefined,
): Rectangle | null => {
  if (!image) return null;
  return {
    left: 0,
    top: 0,
    width: image.offsetWidth,
    height: image.offsetHeight,
  };
};

export const fromNaturalImage = (image: HTMLImageElement): Rectangle => {
  return {
    left: 0,
    top: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};

export const getScaleRange = (source: Rectangle, target: Rectangle): Point => {
  const difference = sizedDivSemigroup.concat(
    target as Point & Sized,
    source as Point & Sized,
  );
  return {
    left: difference.width,
    top: difference.height,
  };
};

export const scaleSelection = (
  source: Rectangle,
  sourceSelection: Rectangle,
  target: Rectangle,
): Rectangle => {
  const sourcePosition = fromRectangle(source);
  const scale = getScaleRange(source, target);
  const newPosition = pointProductSemigroup.concat(sourcePosition, scale);

  return {
    ...newPosition,
    width: sourceSelection.width * scale.left,
    height: sourceSelection.height * scale.top,
  };
};

export const scaleWithSized =
  (s: Sized) =>
  (r: Rectangle): Rectangle => {
    return {
      left: r.left * s.width,
      top: r.top * s.height,
      width: r.width * s.width,
      height: r.height * s.height,
    };
  };

export const divideOnSized =
  (s: Sized) =>
  (r: Rectangle): Rectangle => {
    return {
      left: r.left / s.width,
      top: r.top / s.height,
      width: r.width / s.width,
      height: r.height / s.height,
    };
  };

export const center = (r: Rectangle): Point => {
  return {
    left: r.left + r.width * 0.5,
    top: r.top + r.height * 0.5,
  };
};

export const isClickedInRectBound = (
  event: ClickEvent,
  rect: DOMRect,
): boolean => {
  const { clientX, clientY } = event;

  const inLeftBound = clientX >= rect.left;
  const inRightBound = clientX <= rect.right;
  const inTopBound = clientY >= rect.top;
  const inBottomBound = clientY <= rect.bottom;
  return inLeftBound && inRightBound && inTopBound && inBottomBound;
};
