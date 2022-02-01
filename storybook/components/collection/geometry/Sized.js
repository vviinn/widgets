import { semigroupDiv } from "../utils/semigroup/semigroupDiff";
import { getStructSemigroup } from "fp-ts/Semigroup";
import * as Ord from "fp-ts/Ord";
export const sizedDivSemigroup = getStructSemigroup({
  width: semigroupDiv,
  height: semigroupDiv,
});
export const ordSized = Ord.contramap((s) => s.width * s.height)(Ord.ordNumber);
