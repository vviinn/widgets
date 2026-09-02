import { subFilterSelection } from "./subFilterSelection";

const intervalFilter = (full: { start?: number; end?: number }) =>
  ({ type: "interval", column: "price", full }) as any;

it("selects an interval when the clicked range differs from the full range", () => {
  const filter = intervalFilter({ start: 0, end: 1000 });

  const { filters, action } = subFilterSelection([], filter, {
    interval: { start: 100, end: 200 },
  } as any);

  expect(action).toBe("select");
  expect(filters).toEqual([
    { column: "price", values: [{ start: 100, end: 200 }] },
  ]);
});

it("deselects when the clicked range equals the full range (the guard suggestion chips must avoid)", () => {
  // This is why the suggestion-chip apply path neutralizes `full`: the backend emits
  // `full === selectedValues[0]`, and this guard would otherwise make every click a clear.
  const filter = intervalFilter({ start: 100, end: 200 });

  const { filters, action } = subFilterSelection(
    [{ column: "price", values: [{ start: 100, end: 200 }] }] as any,
    filter,
    { interval: { start: 100, end: 200 } } as any,
  );

  expect(action).toBe("deselect");
  expect(filters).toEqual([]);
});

it("toggles the same interval off when it is already selected (full range neutralized)", () => {
  const filter = intervalFilter({ start: undefined, end: undefined });

  const { filters, action } = subFilterSelection(
    [{ column: "price", values: [{ start: 100, end: 200 }] }] as any,
    filter,
    { interval: { start: 100, end: 200 } } as any,
  );

  expect(action).toBe("deselect");
  expect(filters).toEqual([]);
});
