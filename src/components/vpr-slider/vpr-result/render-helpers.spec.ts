import * as E from "fp-ts/lib/Either";
import { containsFit, processWidth } from "./render-helpers";

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
