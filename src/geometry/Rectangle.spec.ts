import { Rectangle } from "..//interfaces";
import { scaleSelection, getScaleRange, scaleWithSized } from "./Rectangle";

import { Sized } from "./Sized";

it("should return proper scale range", async () => {
  const source: Rectangle = {
    left: 0,
    top: 0,
    width: 50,
    height: 50,
  };

  const target: Rectangle = {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  };

  const result = {
    left: 0.5,
    top: 0.5,
  };

  expect(getScaleRange(target, source)).toStrictEqual(result);
});

it("should scale properly", async () => {
  const source: Rectangle = {
    left: 0,
    top: 0,
    width: 50,
    height: 50,
  };

  const sourceSelection: Rectangle = {
    left: 0,
    top: 0,
    width: 10,
    height: 10,
  };

  const target: Rectangle = {
    left: 0,
    top: 0,
    width: 100,
    height: 100,
  };

  const result: Rectangle = {
    left: 0,
    top: 0,
    width: 20,
    height: 20,
  };

  expect(scaleSelection(source, sourceSelection, target)).toStrictEqual(result);
});

it("should scale rectangle with sizable", async () => {
  const source: Sized = {
    width: 100,
    height: 100,
  };

  const target: Rectangle = {
    left: 0.5,
    top: 0.5,
    width: 0.5,
    height: 0.5,
  };

  const result = {
    left: 50,
    top: 50,
    width: 50,
    height: 50,
  };

  expect(scaleWithSized(source)(target)).toStrictEqual(result);
});
