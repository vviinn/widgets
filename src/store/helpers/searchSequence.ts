import type { SearchStoreName } from "../search.store";

/**
 * Requests are never cancelled, so a slow response can land after a newer one and undo the
 * selection the user already sees. Both search kinds share a store's counter: they write the
 * same fields, so either supersedes what was pending.
 */
const latestSearch = new Map<SearchStoreName, number>();

/** Claims the store's newest slot and returns the predicate for its own response. */
export const startSearch = (store: SearchStoreName): (() => boolean) => {
  const sequence = (latestSearch.get(store) ?? 0) + 1;
  latestSearch.set(store, sequence);

  return () => latestSearch.get(store) !== sequence;
};
