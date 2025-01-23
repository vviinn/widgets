import { scaleBySide, ImageDimension } from "./sizing";

describe("Image sizing utils, smallest side resizing", () => {
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
      size: 300,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 150,
    };

    const scaleDimensions = scaleBySide(150, "smallest");
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
      size: 200,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 400,
    };

    const scaleDimensions = scaleBySide(200, "smallest");
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

    const scaleDimensions = scaleBySide(500, "smallest");
    const result = scaleDimensions([w, h]);
    expect(result).toStrictEqual([expectedWidth, expectedHeight]);
  });
});

describe("Image sizing utils, largest side resizing", () => {
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
      size: 400,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 200,
    };

    const scaleDimensions = scaleBySide(400, "largest");
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
      size: 200,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 400,
    };

    const scaleDimensions = scaleBySide(400, "largest");
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
      size: 400,
    };

    const expectedHeight: ImageDimension = {
      kind: "height",
      size: 400,
    };

    const scaleDimensions = scaleBySide(400, "largest");
    const result = scaleDimensions([w, h]);
    expect(result).toStrictEqual([expectedWidth, expectedHeight]);
  });
});
