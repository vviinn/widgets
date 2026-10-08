import { getProductDataAttributes } from "./helpers";

it("keys each custom label by its feed position, skipping empty ones", () => {
  expect(
    getProductDataAttributes(undefined, [
      "",
      "Bestseller",
      "X",
      "Sponsored",
      "",
    ]),
  ).toEqual({
    "data-custom-label-1": "Bestseller",
    "data-custom-label-2": "X",
    "data-custom-label-3": "Sponsored",
  });
});

it("adds the brand when present", () => {
  expect(getProductDataAttributes("Acme", [])).toEqual({
    "data-brand": "Acme",
  });
});

it("returns no attributes without brand or labels", () => {
  expect(getProductDataAttributes(undefined, ["", "", "", "", ""])).toEqual({});
});
