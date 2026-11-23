import type { Recommendation } from "../../interfaces";

/** The fields a results page writes; a subset of SearchStore so the rule can be tested on its own. */
export type ResultsPageState = {
  results: Recommendation[];
  pageSize: number;
  resultsOffset: number;
  hasMoreResults: boolean;
  loadingMoreResults: boolean;
};

/**
 * The page at offset 0 replaces the list, a later page extends it. The response carries no page
 * size, so the largest page seen is taken as one: a shorter, empty or all-duplicate page ends the
 * list (an API without paging repeats the first page), and a short first page shows Show more once.
 * `resultsOffset` counts what the server sent, duplicates included: the next page starts there.
 */
export const applyResultsPage = (
  state: ResultsPageState,
  products: Recommendation[],
  offset: number,
) => {
  let newProducts = products;

  if (offset === 0) {
    state.results = products;
    state.pageSize = Math.max(state.pageSize, products.length);
  } else {
    const shownIds = new Set(state.results.map(({ productId }) => productId));
    newProducts = products.filter(({ productId }) => !shownIds.has(productId));
    state.results = [...state.results, ...newProducts];
  }

  state.resultsOffset = offset + products.length;
  state.hasMoreResults =
    newProducts.length > 0 && products.length >= state.pageSize;
  state.loadingMoreResults = false;
};
