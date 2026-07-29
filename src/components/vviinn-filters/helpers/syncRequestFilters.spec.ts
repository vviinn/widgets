import { syncRequestFilters } from "./syncRequestFilters";
import { SearchStore } from "../../../store/search.store";
import { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";

type Listener = (value: RequestDynamicFilterItem[]) => void;

const applied = (
  column: string,
  values: string[],
): RequestDynamicFilterItem => ({ column, values });

/** Minimal stand-in for @stencil/store: records the listener and hands back a dispose spy. */
const storeStub = (requestFilters: RequestDynamicFilterItem[]) => {
  const listeners: Listener[] = [];
  const dispose = jest.fn();

  return {
    state: { requestFilters } as SearchStore,
    onChange: ((_key: string, listener: Listener) => {
      listeners.push(listener);
      return dispose;
    }) as never,
    emit: (value: RequestDynamicFilterItem[]) =>
      listeners.forEach((listener) => listener(value)),
    dispose,
  };
};

describe("syncRequestFilters", () => {
  it("seeds the mirror from the store", () => {
    const store = storeStub([applied("brand", ["Mediware"])]);
    const setMirror = jest.fn();

    syncRequestFilters(store.state, store.onChange, setMirror);

    expect(setMirror).toHaveBeenCalledWith([applied("brand", ["Mediware"])]);
  });

  // Regression: empty updates used to be dropped, so a cleared store left stale chips behind.
  it("mirrors an empty update", () => {
    const store = storeStub([applied("brand", ["Mediware"])]);
    const setMirror = jest.fn();

    syncRequestFilters(store.state, store.onChange, setMirror);
    setMirror.mockClear();

    store.emit([]);

    expect(setMirror).toHaveBeenCalledWith([]);
  });

  it("returns the store's dispose function", () => {
    const store = storeStub([]);

    const dispose = syncRequestFilters(store.state, store.onChange, jest.fn());
    dispose();

    expect(store.dispose).toHaveBeenCalledTimes(1);
  });

  // subFilterSelection replaces entries of the array it is handed, so the mirror must not be
  // the store's own array.
  it("hands over a copy, not the store's array", () => {
    const storeFilters = [applied("brand", ["Mediware"])];
    const store = storeStub(storeFilters);
    const setMirror = jest.fn();

    syncRequestFilters(store.state, store.onChange, setMirror);

    expect(setMirror.mock.calls[0][0]).not.toBe(storeFilters);
    expect(setMirror.mock.calls[0][0]).toEqual(storeFilters);
  });
});
