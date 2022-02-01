import { fromRectangle, pointSumSemigroup, pointProductSemigroup, } from "./Point";
import { HandlerDirection } from "../cropper/Handler";
import { sizedDivSemigroup } from "./Sized";
export const move = (origin, position) => {
  const originPosition = fromRectangle(origin);
  const newPosition = pointSumSemigroup.concat(originPosition, position);
  return Object.assign(Object.assign({}, newPosition), { width: origin.width, height: origin.height });
};
const transformNorthEast = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: 0,
    y: handler.position.y,
  });
  return Object.assign(Object.assign({}, newPosition), { width: origin.width + handler.position.x, height: origin.height - handler.position.y });
};
export const transformNorthWest = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), handler.position);
  return Object.assign(Object.assign({}, newPosition), { width: origin.width - handler.position.x, height: origin.height - handler.position.y });
};
const transformSouthEast = (origin, handler) => {
  return Object.assign(Object.assign({}, origin), { width: origin.width + handler.position.x, height: origin.height + handler.position.y });
};
const transformSouthWest = (origin, handler) => {
  const newPosition = pointSumSemigroup.concat(fromRectangle(origin), {
    x: handler.position.x,
    y: 0,
  });
  return Object.assign(Object.assign({}, newPosition), { width: origin.width - handler.position.x, height: origin.height + handler.position.y });
};
export const transform = (origin, handler) => {
  switch (handler.direction) {
    case HandlerDirection.NorthEast:
      return transformNorthEast(origin, handler);
    case HandlerDirection.NorthWest:
      return transformNorthWest(origin, handler);
    case HandlerDirection.SouthEast:
      return transformSouthEast(origin, handler);
    case HandlerDirection.SouthWest:
      return transformSouthWest(origin, handler);
  }
};
export const fromImage = (image) => {
  return {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  };
};
export const fromNaturalImage = (image) => {
  return {
    x: 0,
    y: 0,
    width: image.naturalWidth,
    height: image.naturalHeight,
  };
};
export const getScaleRange = (source, target) => {
  const difference = sizedDivSemigroup.concat(target, source);
  return {
    x: difference.width,
    y: difference.height,
  };
};
export const scaleSelection = (source, sourceSelection, target) => {
  const sourcePosition = fromRectangle(source);
  const scale = getScaleRange(source, target);
  const newPosition = pointProductSemigroup.concat(sourcePosition, scale);
  return Object.assign(Object.assign({}, newPosition), { width: sourceSelection.width * scale.x, height: sourceSelection.height * scale.y });
};
export const fromAlt = (r) => {
  return Object.assign({ x: r.left, y: r.top }, r);
};
export const scaleWithSized = (s) => (r) => {
  return {
    x: r.x * s.width,
    y: r.y * s.height,
    width: r.width * s.width,
    height: r.height * s.height,
  };
};
export const divideOnSized = (s) => (r) => {
  return {
    x: r.x / s.width,
    y: r.y / s.height,
    width: r.width / s.width,
    height: r.height / s.height,
  };
};
export const center = (r) => {
  return {
    x: r.x + r.width * 0.5,
    y: r.y + r.height * 0.5,
  };
};
