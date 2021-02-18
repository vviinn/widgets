import { chunksOf } from "fp-ts/Array";
import { Recommendation } from "../../recommendation/recommendation";

export const rebuildProducts = async (
  products: Recommendation[],
  slideSize: number,
  margin: number,
  itemWidth: number
): Promise<Recommendation[][]> => {
  const avaibleColumns = Math.floor(slideSize / (itemWidth + margin));
  return chunksOf(avaibleColumns > 1 ? avaibleColumns : 1)(products);
};

export const rewrapProducts = async (
  products: Recommendation[],
  columns: number
): Promise<Recommendation[][]> => chunksOf(columns)(products);
