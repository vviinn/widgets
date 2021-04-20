import {
  getStructSemigroup,
  semigroupSum,
  semigroupProduct,
} from "fp-ts/Semigroup";
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

export const fromMouseEvent = ({ clientX, clientY }: MouseEvent): Point => {
  return {
    x: clientX,
    y: clientY,
  };
};

export const pointDiffSemigroup = getStructSemigroup<Point>({
  x: semigroupDiff,
  y: semigroupDiff,
});

export const pointSumSemigroup = getStructSemigroup<Point>({
  x: semigroupSum,
  y: semigroupSum,
});

export const pointProductSemigroup = getStructSemigroup<Point>({
  x: semigroupProduct,
  y: semigroupProduct,
});
