import { applyResultsPage, ResultsPageState } from "./applyResultsPage";
import type { Recommendation } from "../../interfaces";

const products = (...ids: string[]) =>
  ids.map((productId) => ({ productId }) as Recommendation);

const ids = (state: ResultsPageState) =>
  state.results.map(({ productId }) => productId);

const emptyState = (): ResultsPageState => ({
  results: [],
  pageSize: 0,
  resultsOffset: 0,
  hasMoreResults: false,
  loadingMoreResults: false,
});

describe("applyResultsPage", () => {
  it("replaces the list with the first page and expects more", () => {
    const state = { ...emptyState(), results: products("old") };

    applyResultsPage(state, products("a", "b", "c"), 0);

    expect(ids(state)).toEqual(["a", "b", "c"]);
    expect(state.pageSize).toBe(3);
    expect(state.resultsOffset).toBe(3);
    expect(state.hasMoreResults).toBe(true);
  });

  it("appends a later page and continues after it", () => {
    const state = emptyState();
    applyResultsPage(state, products("a", "b"), 0);

    applyResultsPage(state, products("c", "d"), 2);

    expect(ids(state)).toEqual(["a", "b", "c", "d"]);
    expect(state.resultsOffset).toBe(4);
    expect(state.hasMoreResults).toBe(true);
  });

  it("ends on a page shorter than the page size", () => {
    const state = emptyState();
    applyResultsPage(state, products("a", "b"), 0);

    applyResultsPage(state, products("c"), 2);

    expect(state.hasMoreResults).toBe(false);
  });

  it("ends on an empty page and keeps the list", () => {
    const state = emptyState();
    applyResultsPage(state, products("a", "b"), 0);

    applyResultsPage(state, [], 2);

    expect(ids(state)).toEqual(["a", "b"]);
    expect(state.hasMoreResults).toBe(false);
  });

  it("skips products already shown but counts them towards the next offset", () => {
    const state = emptyState();
    applyResultsPage(state, products("a", "b"), 0);

    applyResultsPage(state, products("b", "c"), 2);

    expect(ids(state)).toEqual(["a", "b", "c"]);
    expect(state.resultsOffset).toBe(4);
  });

  it("keeps the page size of the search when a filtered first page comes back short", () => {
    const state = emptyState();
    applyResultsPage(state, products("a", "b", "c"), 0);

    applyResultsPage(state, products("a"), 0);

    expect(state.pageSize).toBe(3);
    expect(state.hasMoreResults).toBe(false);
  });

  it("finishes loading the next page", () => {
    const state = { ...emptyState(), loadingMoreResults: true };

    applyResultsPage(state, products("a"), 0);

    expect(state.loadingMoreResults).toBe(false);
  });
});
