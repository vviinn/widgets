import { Rectangle } from "./Rectangle";
import { getClipValue } from "./Clip";

it("should return proper clip css string with Rectangular type", async () => {
  const image = {
    width: 100,
    height: 100,
  };

  const selection: Rectangle = {
    x: 10,
    y: 0,
    width: 10,
    height: 10,
  };

  const clip = getClipValue(selection, image);
  const result = "inset(0px 80px 90px 10px)";

  expect(clip).toEqual(result);
});
