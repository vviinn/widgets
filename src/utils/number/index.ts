import { Monoid } from "fp-ts/lib/Monoid";
import { Semigroup } from "fp-ts/lib/Semigroup";

export const numberUnderDivisionSemigroup: Semigroup<number> = {
  concat: (x, y) => x / y,
};

export const numberUnderDivisionMonoid: Monoid<number> = {
  ...numberUnderDivisionSemigroup,
  empty: 1,
};

export const calculateDiscount = (price: number, discount: number) => {
  return Math.round(price * (1 - discount / 100) * 100) / 100;
};
