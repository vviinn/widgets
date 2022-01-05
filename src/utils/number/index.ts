import { Monoid } from "fp-ts/lib/Monoid";
import { Semigroup } from "fp-ts/lib/Semigroup";

export const numberUnderDivisionSemigroup: Semigroup<number> = {
  concat: (x, y) => x / y,
};

export const numberUnderDivisionMonoid: Monoid<number> = {
  ...numberUnderDivisionSemigroup,
  empty: 1,
};
