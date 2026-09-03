import { syncRequestFilters } from "./syncRequestFilters";
import type { SearchStore } from "../../../store/search.store";
import type { RequestDynamicFilterItem } from "../../../campaign/VPRCampaignService";
import { appliedFilter } from "../../../filters/testFixtures";

type Listener = (value: RequestDynamicFilterItem[]) => void;

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
  it("seeds the local copy from the store", () => {
    const store = storeStub([appliedFilter("brand", ["Mediware"])]);
    const setRequestFilters = jest.fn();

    syncRequestFilters(store.state, store.onChange, setRequestFilters);

    expect(setRequestFilters).toHaveBeenCalledWith([
      appliedFilter("brand", ["Mediware"]),
    ]);
  });

  it("applies an empty update", () => {
    const store = storeStub([appliedFilter("brand", ["Mediware"])]);
    const setRequestFilters = jest.fn();

    syncRequestFilters(store.state, store.onChange, setRequestFilters);
    setRequestFilters.mockClear();

    store.emit([]);

    expect(setRequestFilters).toHaveBeenCalledWith([]);
  });

  it("returns the store's dispose function", () => {
    const store = storeStub([]);

    const dispose = syncRequestFilters(store.state, store.onChange, jest.fn());
    dispose();

    expect(store.dispose).toHaveBeenCalledTimes(1);
  });

  it("hands over a copy, not the store's array", () => {
    const storeFilters = [appliedFilter("brand", ["Mediware"])];
    const store = storeStub(storeFilters);
    const setRequestFilters = jest.fn();

    syncRequestFilters(store.state, store.onChange, setRequestFilters);

    expect(setRequestFilters.mock.calls[0][0]).not.toBe(storeFilters);
    expect(setRequestFilters.mock.calls[0][0]).toEqual(storeFilters);
  });
});
