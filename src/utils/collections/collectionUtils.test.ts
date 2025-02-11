import { addIfDefined, addIfNotEmpty } from "./collectionsUtils";

describe("addIfDefined", () => {
  it("should return empty object if value is null", () => {
    expect(addIfDefined("key", null)).toEqual({});
  });

  it("should return empty object if value is undefined", () => {
    expect(addIfDefined("key", undefined)).toEqual({});
  });

  it("should return object with key and value if value is not null or undefined", () => {
    expect(addIfDefined("key", "value")).toEqual({ key: "value" });
  });

  it("should return object with key and value if value is 0", () => {
    expect(addIfDefined("key", 0)).toEqual({ key: 0 });
  });
});

describe("addIfNotEmpty", () => {
  it("should return empty object if value is null", () => {
    expect(addIfNotEmpty("key", null)).toEqual({});
  });

  it("should return empty object if value is undefined", () => {
    expect(addIfNotEmpty("key", undefined)).toEqual({});
  });

  it("should return empty object if value is empty array", () => {
    expect(addIfNotEmpty("key", [])).toEqual({});
  });

  it("should return empty object if value is empty object", () => {
    expect(addIfNotEmpty("key", {})).toEqual({});
  });

  it("should return object with key and value if value is not null or undefined", () => {
    expect(addIfNotEmpty("color", "#ffd500")).toEqual({ color: "#ffd500" });
  });

  it("should return object with key and value if value is array with one element", () => {
    expect(
      addIfNotEmpty("excluded", [
        {
          column: "brand",
          values: ["Nike"],
        },
      ]),
    ).toEqual({
      excluded: [
        {
          column: "brand",
          values: ["Nike"],
        },
      ],
    });
  });

  it("should return object with key and value if value is object with one key", () => {
    expect(
      addIfNotEmpty("staticFilters", {
        color: "#ffd500",
        excluded: [
          {
            column: "brand",
            values: ["Nike"],
          },
        ],
      }),
    ).toEqual({
      staticFilters: {
        color: "#ffd500",
        excluded: [
          {
            column: "brand",
            values: ["Nike"],
          },
        ],
      },
    });
  });
});
