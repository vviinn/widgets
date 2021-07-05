import * as E from "fp-ts/lib/Either";
import { containsFit, processWidth, getPrice } from "./render-helpers";
import { Recommendation } from "../../../recommendation/recommendation";

it("should return right for string contains fit", async () => {
  const url = "https://cdn.vviinn.com/0/fit/400/something";
  const result = containsFit(url);

  expect(E.isRight(result)).toBeTruthy;
});

it("should return left for string contains fit", async () => {
  const url = "https://something";
  const result = containsFit(url);

  expect(E.isLeft(result)).toBeTruthy;
});

it("should change fit", async () => {
  const url = "https://cdn.vviinn.com/0/fit/100/something";
  const result = processWidth(url, 500);

  expect(result).toEqual("https://cdn.vviinn.com/0/fit/500/something");
});

it("should return same string for url without fit", async () => {
  const url = "https://something";
  const result = processWidth(url, 500);

  expect(result).toEqual("https://something");
});

it("should return sale price (sale bigger than actual)", async () => {
  const data: Recommendation["price"] = {
    actual: 100,
    sale: 750,
  };

  const result = getPrice(data);

  expect(result).toEqual({ _tag: "Left", left: 100 });
});

it("should return sale price (sale less than actual)", async () => {
  const data: Recommendation["price"] = {
    actual: 100,
    sale: 75,
  };

  const result = getPrice(data);

  expect(result).toEqual({ _tag: "Right", right: [75, 100] });
});

it("should return sale price (only sale)", async () => {
  const data: Recommendation["price"] = {
    sale: 75,
  };

  const result = getPrice(data);

  expect(result).toEqual({ _tag: "Left", left: 75 });
});

it("should return sale price (only actual)", async () => {
  const data: Recommendation["price"] = {
    actual: 100,
  };

  const result = getPrice(data);

  expect(result).toEqual({ _tag: "Left", left: 100 });
});
