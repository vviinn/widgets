import {
  addIfDefined,
  addIfNotEmpty,
  parseStringToExcluded,
} from "./collectionsUtils";

describe("addIfDefined", () => {
  test.each([
    ["null value", "key", null, {}],
    ["undefined value", "key", undefined, {}],
    ["empty string", "key", "", { key: "" }],
    ["non-null string", "key", "value", { key: "value" }],
    ["zero value", "key", 0, { key: 0 }],
  ])("should return correct result for %s", (_, key, value, expected) => {
    expect(addIfDefined(key, value)).toEqual(expected);
  });
});

describe("addIfNotEmpty", () => {
  test.each([
    ["null value", "key", null, {}],
    ["undefined value", "key", undefined, {}],
    ["empty string", "key", "", {}],
    ["empty array", "key", [], {}],
    ["empty object", "key", {}, {}],
    ["non-empty string", "color", "#ffd500", { color: "#ffd500" }],
    [
      "array with one element",
      "excluded",
      [{ column: "brand", values: ["Nike"] }],
      { excluded: [{ column: "brand", values: ["Nike"] }] },
    ],
    [
      "object with one key",
      "staticFilters",
      {
        color: "#ffd500",
        excluded: [{ column: "brand", values: ["Nike"] }],
      },
      {
        staticFilters: {
          color: "#ffd500",
          excluded: [{ column: "brand", values: ["Nike"] }],
        },
      },
    ],
  ])("should return correct result for %s", (_, key, value, expected) => {
    expect(addIfNotEmpty(key, value)).toEqual(expected);
  });
});

describe("parseStringToExcluded", () => {
  test.each([
    ["empty string", "", []],
    [
      "string with one column",
      "column1:value1,value2",
      [{ column: "column1", values: ["value1", "value2"] }],
    ],
    [
      "string with multiple columns",
      "column1:value1,value2;column2:value3,value4",
      [
        { column: "column1", values: ["value1", "value2"] },
        { column: "column2", values: ["value3", "value4"] },
      ],
    ],
  ])("should parse %s correctly", (_, input, expected) => {
    expect(parseStringToExcluded(input)).toEqual(expected);
  });
});
