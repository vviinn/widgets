import { Semigroup } from "fp-ts/Semigroup";

export const semigroupDiff: Semigroup<number> = {
  concat: (x, y) => x - y,
};
