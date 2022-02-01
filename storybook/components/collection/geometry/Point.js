import { semigroupSum, semigroupProduct, struct } from "fp-ts/Semigroup";
import { semigroupDiff } from "../utils/semigroup/semigroupDiff";
export const fromRectangle = ({ x, y }) => {
  return {
    x,
    y,
  };
};
export const fromMouseEvent = ({ clientX, clientY }) => {
  return {
    x: clientX,
    y: clientY,
  };
};
export const fromTouchEvent = ({ touches }) => {
  return {
    x: touches[0].clientX,
    y: touches[0].clientY,
  };
};
export const pointDiffSemigroup = struct({
  x: semigroupDiff,
  y: semigroupDiff,
});
export const pointSumSemigroup = struct({
  x: semigroupSum,
  y: semigroupSum,
});
export const pointProductSemigroup = struct({
  x: semigroupProduct,
  y: semigroupProduct,
});
