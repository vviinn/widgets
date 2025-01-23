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
  OrdNumber,
);
const ordByKind: Ord<ImageDimension> = {
  equals: (x, y) => x.kind === y.kind,
  compare: (x, y) => {
    return x.kind === y.kind ? 0 : x.kind === "width" ? -1 : 1;
  },
};

const sortDimensionsBySize = sort(ordBySize);
const sortDimensionsByKind = sort(ordByKind);

const getDimensionsRatio = (sortedDimensions: ImageDimensions): number => {
  const [smallest, largest] = sortedDimensions;
  return smallest.size / largest.size;
};

export const scaleBySide =
  (toSize: number, comparedSide: "smallest" | "largest") =>
  (dimensions: ImageDimensions): ImageDimensions => {
    const sortedDimensions = sortDimensionsBySize(dimensions);
    const ratio = getDimensionsRatio(sortedDimensions);

    const newSmallestSide: ImageDimension = {
      ...sortedDimensions[0],
      size: comparedSide === "smallest" ? toSize : toSize * ratio,
    };

    const newLargestSide: ImageDimension = {
      ...sortedDimensions[1],
      size: comparedSide === "largest" ? toSize : toSize / ratio,
    };

    return sortDimensionsByKind([newLargestSide, newSmallestSide]);
  };

export const dimensionsFromImage = (
  image: HTMLImageElement,
): ImageDimensions => {
  const { naturalWidth, naturalHeight } = image;
  return [makeWidth(naturalWidth), makeHeight(naturalHeight)];
};

export const getImageSizes = (
  i: HTMLImageElement,
  defaultImageSize: number,
): [number, number] => {
  const dimensions = dimensionsFromImage(i);
  const resize = scaleBySide(defaultImageSize, "largest");
  const newDimensions = resize(dimensions);

  const sizes = newDimensions.map((d) => d.size);
  return [sizes[0], sizes[1]];
};
