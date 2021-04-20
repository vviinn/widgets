import { Semigroup } from "fp-ts/Semigroup";

export const semigroupDiff: Semigroup<number> = {
  concat: (x, y) => x - y,
};

export const semigroupDiv: Semigroup<number> = {
  concat: (x, y) => x / y,
};
