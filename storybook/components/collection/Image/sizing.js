import { Ord as OrdNumber } from "fp-ts/lib/number";
import { contramap } from "fp-ts/lib/Ord";
import { sort } from "fp-ts/lib/Array";
const makeWidth = (size) => {
  return {
    kind: "width",
    size,
  };
};
const makeHeight = (size) => {
  return {
    kind: "height",
    size,
  };
};
const ordBySize = contramap((s) => s.size)(OrdNumber);
const ordByKind = {
  equals: (x, y) => x.kind === y.kind,
  compare: (x, y) => {
    return x.kind === y.kind ? 0 : x.kind === "width" ? -1 : 1;
  },
};
const sortDimentionsBySize = sort(ordBySize);
const sortDimentionsByKind = sort(ordByKind);
const getDimentionsRatio = (sortedDimensions) => {
  const [smallest, largest] = sortedDimensions;
  return smallest.size / largest.size;
};
export const scaleByLargestSide = (toSize) => (dimensions) => {
  const sortedDimensions = sortDimentionsBySize(dimensions);
  const ratio = getDimentionsRatio(sortedDimensions);
  const newSmallestSide = Object.assign(Object.assign({}, sortedDimensions[0]), { size: toSize * ratio });
  const newLargestSide = Object.assign(Object.assign({}, sortedDimensions[1]), { size: toSize });
  return sortDimentionsByKind([newLargestSide, newSmallestSide]);
};
export const dimensionsFromImage = (image) => {
  const { naturalWidth, naturalHeight } = image;
  return [makeWidth(naturalWidth), makeHeight(naturalHeight)];
};
