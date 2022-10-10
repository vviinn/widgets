import { Ord as OrdNumber } from "fp-ts/lib/number";
import { Ord, contramap } from "fp-ts/lib/Ord";
import { sort } from "fp-ts/lib/Array";

type ImageWidth = "width";
type ImageHeight = "height";

export type ImageDimension = {
  readonly kind: ImageWidth | ImageHeight;
  readonly size: number;
};

const makeWidth = (size: number): ImageDimension => {
  return {
    kind: "width",
    size,
  };
};

const makeHeight = (size: number): ImageDimension => {
  return {
    kind: "height",
    size,
  };
};

type ImageDimensions = ImageDimension[];

const ordBySize: Ord<ImageDimension> = contramap((s: ImageDimension) => s.size)(
  OrdNumber
);
const ordByKind: Ord<ImageDimension> = {
  equals: (x, y) => x.kind === y.kind,
  compare: (x, y) => {
    return x.kind === y.kind ? 0 : x.kind === "width" ? -1 : 1;
  },
};

const sortDimentionsBySize = sort(ordBySize);
const sortDimentionsByKind = sort(ordByKind);

const getDimentionsRatio = (sortedDimensions: ImageDimensions): number => {
  const [smallest, largest] = sortedDimensions;
  return smallest.size / largest.size;
};

export const scaleByLargestSide =
  (toSize: number) =>
  (dimensions: ImageDimensions): ImageDimensions => {
    const sortedDimensions = sortDimentionsBySize(dimensions);
    const ratio = getDimentionsRatio(sortedDimensions);

    const newSmallestSide: ImageDimension = {
      ...sortedDimensions[0],
      size: toSize * ratio,
    };

    const newLargestSide: ImageDimension = {
      ...sortedDimensions[1],
      size: toSize,
    };

    return sortDimentionsByKind([newLargestSide, newSmallestSide]);
  };

export const dimensionsFromImage = (
  image: HTMLImageElement
): ImageDimensions => {
  const { naturalWidth, naturalHeight } = image;
  return [makeWidth(naturalWidth), makeHeight(naturalHeight)];
};
