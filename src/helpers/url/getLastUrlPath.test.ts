import { getLastUrlPath } from "./getLastUrlPath";

describe("getLastUrlPath", () => {
  it("returns the last path segment with a leading slash", () => {
    expect(getLastUrlPath("https://example.com/foo/bar")).toBe("/bar");
    expect(getLastUrlPath("http://example.com/foo/bar/")).toBe("/bar");
    expect(getLastUrlPath("/foo/bar")).toBe("/bar");
    expect(getLastUrlPath("foo/bar")).toBe("/bar");
  });

  it("returns the full link if no path segment can be extracted", () => {
    expect(getLastUrlPath("https://example.com/")).toBe("https://example.com/");
    expect(getLastUrlPath("http://example.com")).toBe("http://example.com");
    expect(getLastUrlPath("")).toBe("");
    expect(getLastUrlPath(undefined)).toBe("");
  });

  it("handles URLs with query and hash", () => {
    expect(getLastUrlPath("https://example.com/foo/bar?baz=1")).toBe("/bar");
    expect(getLastUrlPath("https://example.com/foo/bar#section")).toBe("/bar");
  });

  it("returns the input for non-URL strings", () => {
    expect(getLastUrlPath("not/a/url")).toBe("not/a/url");
    expect(getLastUrlPath("justastring")).toBe("justastring");
  });
});
