import { QueryContextProperties } from "vviinn-tracking-client-ts";

import { addIfNotEmpty } from "../utils/collections/collectionsUtils";

type QueryContextSource = {
  query?: string | null;
  sourceProductId?: string;
};

/**
 * What produced the results: the search term or the product the recommendations are for.
 * Result and product events carry it, so a product interaction can be traced back to it.
 */
export const createQueryContext = ({
  query,
  sourceProductId,
}: QueryContextSource): QueryContextProperties => ({
  ...addIfNotEmpty("query", query?.trim()),
  ...addIfNotEmpty("source_product_id", sourceProductId),
});
