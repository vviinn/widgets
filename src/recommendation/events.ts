export type ProductCardEventData = {
  product: string;
  rank: number;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
