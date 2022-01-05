import { scaleByLargestSide, ImageDimension } from "./sizing";

describe("Image sizing utils", () => {
  it("should resize correctly if width > height", () => {
    const w: ImageDimension = {
      kind: "width",
      size: 600,
    };

    const h: ImageDimension = {
      kind: "height",
      size: 300,
    };

    const expectedWidth: ImageDimension = {
      kind: "width",
      size: 500,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 250,
    };

    const scaleDimensions = scaleByLargestSide(500);
    const result = scaleDimensions([w, h]);
    expect(result).toStrictEqual([expectedWidth, expectedHeight]);
  });

  it("should resize correctly if width < height", () => {
    const w: ImageDimension = {
      kind: "width",
      size: 300,
    };

    const h: ImageDimension = {
      kind: "height",
      size: 600,
    };

    const expectedWidth: ImageDimension = {
      kind: "width",
      size: 250,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 500,
    };

    const scaleDimensions = scaleByLargestSide(500);
    const result = scaleDimensions([w, h]);
    expect(result).toStrictEqual([expectedWidth, expectedHeight]);
  });

  it("should resize correctly if width == height", () => {
    const w: ImageDimension = {
      kind: "width",
      size: 600,
    };

    const h: ImageDimension = {
      kind: "height",
      size: 600,
    };

    const expectedWidth: ImageDimension = {
      kind: "width",
      size: 500,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 500,
    };

    const scaleDimensions = scaleByLargestSide(500);
    const result = scaleDimensions([w, h]);
    expect(result).toStrictEqual([expectedWidth, expectedHeight]);
  });
});
