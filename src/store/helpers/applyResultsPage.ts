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
 * The page at offset 0 replaces the list, a later page extends it. The search fills every page
 * but the last, so the largest page seen is the page size and a shorter or empty one is the end.
 * A later page with nothing new ends it too: an API without paging repeats the first page.
 *
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
