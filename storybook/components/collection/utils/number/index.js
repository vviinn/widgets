export const numberUnderDivisionSemigroup = {
  concat: (x, y) => x / y,
};
export const numberUnderDivisionMonoid = Object.assign(Object.assign({}, numberUnderDivisionSemigroup), { empty: 1 });
