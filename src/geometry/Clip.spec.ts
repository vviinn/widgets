import { Rectangle } from "../interfaces";
import { getClipValue } from "./Clip";

it("should return proper clip css string with Rectangular type", async () => {
  const image = {
    width: 100,
    height: 100,
  };

  const selection: Rectangle = {
    left: 10,
    top: 0,
    width: 10,
    height: 10,
  };

  const clip = getClipValue(selection, image);
  const result = "inset(0px 80px 90px 10px)";

  expect(clip).toEqual(result);
});
