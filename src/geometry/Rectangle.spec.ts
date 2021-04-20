import {
  Rectangle,
  scaleSelection,
  getScaleRange,
  scaleWithSized,
} from "./Rectangle";

import { Sized } from "./Sized";

it("should return proper scale range", async () => {
  const source: Rectangle = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  };

  const target: Rectangle = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  const result = {
    x: 0.5,
    y: 0.5,
  };

  expect(getScaleRange(target, source)).toStrictEqual(result);
});

it("should scale properly", async () => {
  const source: Rectangle = {
    x: 0,
    y: 0,
    width: 50,
    height: 50,
  };

  const sourceSelection: Rectangle = {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  };

  const target: Rectangle = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };

  const result: Rectangle = {
    x: 0,
    y: 0,
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
    x: 0.5,
    y: 0.5,
    width: 0.5,
    height: 0.5,
  };

  const result = {
    x: 50,
    y: 50,
    width: 50,
    height: 50,
  };

  expect(scaleWithSized(source)(target)).toStrictEqual(result);
});
