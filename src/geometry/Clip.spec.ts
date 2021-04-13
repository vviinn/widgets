import * as RectAlt from "./RectangleAlt";
import * as Rect from "./Rectangle";
import { getClipValue } from "./Clip";

it("should return proper clip css string with RectangularAlt type", async () => {
  const image = {
    width: 100,
    height: 100
  };

  const selection: RectAlt.RectangleAlt = {
    top: 0.1,
    left: 0.1,
    width: 0.5,
    height: 0.5
  };

  const shape = RectAlt.of(selection);
  const clip = getClipValue(shape, image);
  const result = "inset(10px 40px 40px 10px)";

  expect(clip).toEqual(result);
});

it("should return proper clip css string with Rectangular type", async () => {
  const image = {
    width: 100,
    height: 100
  };

  const selection: Rect.Rectangle = {
    position: {
      x: 10,
      y: 0
    },
    width: 10,
    height: 10
  };

  const shape = Rect.of(selection);
  const clip = getClipValue(shape, image);
  const result = "inset(0px 80px 90px 10px)";

  expect(clip).toEqual(result);
});
