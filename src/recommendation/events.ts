export type ProductCardEventData = {
  productId: string;
  productPosition: number;
};

export type ProductCardEvent = CustomEvent<ProductCardEventData>;
