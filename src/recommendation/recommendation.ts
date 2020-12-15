export interface Recommendation {
  groupId?: string | null;
  productId?: string;
  title?: string;
  deeplink?: string | null;
  brand?: string | null;
  productType?: string | null;
  image?: { original?: string; thumbnail?: string | null };
  price?: { actual?: number | null; sale?: number | null };
}
