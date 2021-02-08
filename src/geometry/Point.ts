import { getStructSemigroup, semigroupSum } from "fp-ts/Semigroup";
import { semigroupDiff } from "../utils/semigroup/semigroupDiff";

export interface Point {
  readonly x: number;
  readonly y: number;
}

export const fromMouseEvent = (e: MouseEvent): Point => {
  return {
    x: e.clientX,
    y: e.clientY,
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
