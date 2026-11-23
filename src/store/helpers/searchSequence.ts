import type { SearchStoreName } from "../search.store";

/** A per-store counter: each start claims the newest slot and returns the predicate for its own outcome. */
const createSequence = () => {
  const latest = new Map<SearchStoreName, number>();

  return (store: SearchStoreName): (() => boolean) => {
    const sequence = (latest.get(store) ?? 0) + 1;
    latest.set(store, sequence);

    return () => latest.get(store) !== sequence;
  };
};

/**
 * Requests are never cancelled, so a slow response can land after a newer one and undo the
 * selection the user already sees. Both search kinds share a store's counter: they write the
 * same fields, so either supersedes what was pending.
 */
export const startSearch = createSequence();

/** An upload's hi-res search can outlive the upload after it, which then owns hiResPending. */
export const startUpload = createSequence();
