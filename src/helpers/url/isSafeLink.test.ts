import { isSafeLink } from "./isSafeLink";

describe("isSafeLink", () => {
  it.each(["https://shop.com/p/1", "http://shop.com/p/1", "/p/1", "p/1"])(
    "accepts %s",
    (url) => {
      expect(isSafeLink(url)).toBe(true);
    },
  );

  it.each([
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "",
    null,
    undefined,
  ])("rejects %p", (url) => {
    expect(isSafeLink(url)).toBe(false);
  });
});
