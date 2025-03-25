import { semigroupSum, semigroupProduct, struct } from "fp-ts/Semigroup";
import { ClientEvent } from "../utils/event/Events";
import { semigroupDiff } from "../utils/semigroup/semigroupDiff";
import { Rectangle } from "../interfaces/search";

export type Point = {
  readonly left: number;
  readonly top: number;
};

export const fromRectangle = ({ left, top }: Rectangle): Point => {
  return {
    left,
    top,
  };
};

export const fromMouseEvent = ({ clientX, clientY }: ClientEvent): Point => {
  return {
    left: clientX,
    top: clientY,
  };
};

export const fromTouchEvent = ({ touches }: TouchEvent): Point => {
  return {
    left: touches[0].clientX,
    top: touches[0].clientY,
  };
};

export const pointDiffSemigroup = struct<Point>({
  left: semigroupDiff,
  top: semigroupDiff,
});

export const pointSumSemigroup = struct<Point>({
  left: semigroupSum,
  top: semigroupSum,
});

export const pointProductSemigroup = struct<Point>({
  left: semigroupProduct,
  top: semigroupProduct,
});
