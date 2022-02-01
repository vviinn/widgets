import { chunksOf } from "fp-ts/Array";
export const rebuildProducts = async (products, slideSize, margin, itemWidth) => {
  const avaibleColumns = Math.floor(slideSize / (itemWidth + margin));
  return chunksOf(avaibleColumns > 1 ? avaibleColumns : 1)(products);
};
export const rewrapProducts = async (products, columns) => chunksOf(columns)(products);
