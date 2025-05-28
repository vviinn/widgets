import { joinTruthy } from "./joinTruthy";

describe("joinTruthy", () => {
  it("joins non-falsy strings with spaces", () => {
    expect(joinTruthy(["a", "b", "c"])).toBe("a b c");
    expect(joinTruthy(["hello", "world"])).toBe("hello world");
  });

  it("filters out falsy values", () => {
    expect(joinTruthy(["a", "", "b", false, "c", undefined, null])).toBe(
      "a b c",
    );
    expect(joinTruthy([undefined, null, false, "", 0 as any])).toBe("");
  });

  it("returns an empty string for empty array", () => {
    expect(joinTruthy([])).toBe("");
  });

  it("handles single non-falsy value", () => {
    expect(joinTruthy(["only"])).toBe("only");
  });
});
