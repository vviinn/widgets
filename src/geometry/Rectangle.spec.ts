import { Rectangle, scaleSelection } from "./Rectangle";

it("should LOL", async () => {
  const source: Rectangle = {
    position: {
      x: 0,
      y: 0,
    },
    width: 50,
    height: 50,
  };

  const sourceSelection: Rectangle = {
    position: {
      x: 0,
      y: 0,
    },
    width: 10,
    height: 10,
  };

  const target: Rectangle = {
    position: {
      x: 0,
      y: 0,
    },
    width: 100,
    height: 100,
  };

  const result: Rectangle = {
    position: {
      x: 0,
      y: 0,
    },
    width: 20,
    height: 20,
  };

  expect(scaleSelection(source, sourceSelection, target)).toStrictEqual(result);
});
