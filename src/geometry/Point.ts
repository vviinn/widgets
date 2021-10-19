import { semigroupSum, semigroupProduct, struct } from "fp-ts/Semigroup";
import { ClientEvent } from "../utils/event/Events";
import { semigroupDiff } from "../utils/semigroup/semigroupDiff";
import { Rectangle } from "./Rectangle";

export type Point = {
  readonly x: number;
  readonly y: number;
};

export const fromRectangle = ({ x, y }: Rectangle): Point => {
  return {
    x,
    y,
  };
};

export const fromMouseEvent = ({ clientX, clientY }: ClientEvent): Point => {
  return {
    x: clientX,
    y: clientY,
  };
};

export const fromTouchEvent = ({ touches }: TouchEvent): Point => {
  return {
    x: touches[0].clientX,
    y: touches[0].clientY,
  };
};

export const pointDiffSemigroup = struct<Point>({
  x: semigroupDiff,
  y: semigroupDiff,
});

export const pointSumSemigroup = struct<Point>({
  x: semigroupSum,
  y: semigroupSum,
});

export const pointProductSemigroup = struct<Point>({
  x: semigroupProduct,
  y: semigroupProduct,
});
