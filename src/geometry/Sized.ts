import { semigroupDiv } from "../utils/semigroup/semigroupDiff";
import { getStructSemigroup } from "fp-ts/Semigroup";
import * as Ord from "fp-ts/Ord";

export type Sized = {
  readonly width?: number;
  readonly height?: number;
};

export const sizedDivSemigroup = getStructSemigroup<Sized>({
  width: semigroupDiv,
  height: semigroupDiv,
});

export const ordSized: Ord.Ord<Sized> = Ord.contramap<number, Sized>(
  (s) => s.width * s.height,
)(Ord.ordNumber);
